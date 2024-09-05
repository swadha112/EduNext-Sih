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

# Set the Google API key in environment
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDqdkUPxpYe_8AEW-BJeluw_ITjNSMHRTM"

# Initialize the Google Generative AI with the specified model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

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

store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

def choose_session():
    choice = input("Enter '1' to start a new session or '2' to load an existing session: ")
    if choice == '1':
        new_session_id = generate_random_string(6)
        store[new_session_id] = ChatMessageHistory()  # Initialize new session
        return new_session_id
    elif choice == '2':
        session_id = input("Enter your previous session ID: ")
        history = load_chat_history(session_id)
        if history:
            store[session_id] = history
            print("Previous session loaded successfully.")
            return session_id
        else:
            print("Session not found. Starting a new session.")
            new_session_id = generate_random_string(6)
            store[new_session_id] = ChatMessageHistory()  # Initialize new session
            return new_session_id
    else:
        print("Invalid choice. Starting a new session.")
        new_session_id = generate_random_string(6)
        store[new_session_id] = ChatMessageHistory()  # Initialize new session
        return new_session_id

def find_previous_response(history, user_input):
    for i in range(len(history.messages) - 1):
        if isinstance(history.messages[i], HumanMessage) and user_input.lower() in history.messages[i].content.lower():
            return history.messages[i+1].content
    return None

print("Career Guidance AI Chatbot")
language = input("Select your language (English, Hindi, German, French, Bengali): ")

session_id = choose_session()
config = {"configurable": {"session_id": session_id}}

print(f"Your session ID is: {session_id}")
print("You can use this ID to continue your conversation later.")

with_message_history = RunnableWithMessageHistory(llm, get_session_history)

while True:
    prompt_input = input("Message Here (type 'exit' to quit): ")

    if prompt_input.lower() == 'exit':
        print("Exiting the chatbot. Saving chat history...")
        save_chat_history(session_id, store[session_id])
        print("Goodbye!")
        break

    if prompt_input:
        previous_response = find_previous_response(store[session_id], prompt_input)
        
        if previous_response:
            print(f"Previously, I responded to a similar query with: {previous_response}")
            print("Would you like to build upon this or ask something new?")
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a career counselor, specializing in attracting learners towards their studies. "
                       "Ask the user how they want to attract their life towards studies. "
                       "Write a dialogue or narrative where you discuss their motivations, skills, and goals within this field. "
                       "Offer personalized guidance, outlining potential career paths, necessary skills or qualifications, and practical steps they can take to achieve their aspirations. "
                       "Give all the answers in {language} language."),
            MessagesPlaceholder(variable_name="messages"),
        ])
        chain = prompt | llm

        with_message_history = RunnableWithMessageHistory(
            chain,
            get_session_history,
            input_messages_key="messages",
        )

        response = with_message_history.invoke(
            {"messages": [HumanMessage(content=prompt_input)], "language": language},
            config=config,
        )

        print("AI Response:", response.content)