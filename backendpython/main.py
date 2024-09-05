from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import os
import json
import random
import string
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

app = FastAPI()

# Set the Google API key in the environment
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDqdkUPxpYe_8AEW-BJeluw_ITjNSMHRTM"

# Initialize the Google Generative AI with the specified model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Store to keep track of sessions
store = {}

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str):
        self.active_connections.pop(session_id, None)

    async def send_message(self, message: str, session_id: str):
        websocket = self.active_connections.get(session_id)
        if websocket:
            await websocket.send_text(message)

manager = ConnectionManager()

def generate_random_string(length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for _ in range(length))

def save_chat_history(session_id, history):
    filename = f"chat_history_{session_id}.json"
    with open(filename, 'w') as f:
        json.dump([
            {"role": "human" if isinstance(msg, HumanMessage) else "ai", "content": msg.content}
            for msg in history.messages
        ], f, indent=2)
    print(f"Chat history saved to {filename}")

def load_chat_history(session_id):
    filename = f"chat_history_{session_id}.json"
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            messages = json.load(f)
        history = ChatMessageHistory()
        for msg in messages:
            if msg['role'] == 'human':
                history.add_user_message(msg['content'])
            else:
                history.add_ai_message(msg['content'])
        return history
    return None

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def find_previous_response(history, user_input):
    for i in range(len(history.messages) - 1):
        if isinstance(history.messages[i], HumanMessage) and user_input.lower() in history.messages[i].content.lower():
            return history.messages[i+1].content
    return None

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await manager.connect(websocket, session_id)
    try:
        while True:
            data = await websocket.receive_text()

            if data == "new_session":
                new_session_id = generate_random_string(6)
                store[new_session_id] = ChatMessageHistory()
                await websocket.send_text(f"New session created with ID {new_session_id}.")

                # Update the connection manager to use the new session ID
                manager.disconnect(session_id)  # Disconnect the old session ID
                await manager.connect(websocket, new_session_id)  # Reconnect with new session ID
                session_id = new_session_id  # Update session_id to the new one

            elif data.startswith("load_session:"):
                requested_session_id = data.split(":")[1]
                if requested_session_id in store:
                    await websocket.send_text(f"Session {requested_session_id} loaded successfully.")
                else:
                    await websocket.send_text("Invalid session ID. Please start a new session.")

            else:
                history = get_session_history(session_id)
                previous_response = find_previous_response(history, data)

                if previous_response:
                    await websocket.send_text(previous_response)
                else:
                    # Create and invoke the chain
                    prompt = ChatPromptTemplate.from_messages([
                        ("system", "You are a career counselor, specializing in attracting learners towards their studies. "
                                   "Ask the user how they want to attract their life towards studies. "
                                   "Write a dialogue or narrative where you discuss their motivations, skills, and goals within this field. "
                                   "Offer personalized guidance, outlining potential career paths, necessary skills or qualifications, and practical steps they can take to achieve their aspirations."),
                        MessagesPlaceholder(variable_name="messages"),
                    ])
                    chain = prompt | llm

                    with_message_history = RunnableWithMessageHistory(
                        chain,
                        get_session_history,
                        input_messages_key="messages",
                    )

                    response = with_message_history.invoke(
                        {"messages": [HumanMessage(content=data)], "language": "English"},
                        config={"configurable": {"session_id": session_id}},
                    )

                    await websocket.send_text(response.content)
    except WebSocketDisconnect:
        # On disconnect, gather the chat log
        history = get_session_history(session_id)
        chat_log = [
            {"role": "human" if isinstance(msg, HumanMessage) else "ai", "content": msg.content}
            for msg in history.messages
        ]

        # Attempt to send the chat log
        try:
            await websocket.send_text(f"Chat log: {json.dumps(chat_log)}")
        except RuntimeError:
            # Log or handle the situation where the websocket might have already closed
            print("WebSocket already closed; unable to send chat log.")
    finally:
        # Ensure cleanup
        manager.disconnect(session_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


