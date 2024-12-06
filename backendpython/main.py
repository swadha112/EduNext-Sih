from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from moviepy.editor import VideoFileClip
import speech_recognition as sr
import re
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

# Initialize FastAPI app
app = FastAPI()

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace '*' with specific frontend URLs for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set the Google API key in the environment
if "GOOGLE_API_KEY" not in os.environ:
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDCMWFGzDZh06-i-VJ23iOc-1QPyhTXAVU"

# Initialize the Google Generative AI with the specified model
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

# Store to keep track of sessions
store = {}

# WebSocket Manager
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

# Helper Functions for WebSocket and Chat History
def generate_random_string(length):
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for _ in range(length))

def save_chat_history(session_id, history):
    filename = f"chat_history_{session_id}.json"
    with open(filename, 'w') as f:
        json.dump([{"role": "human" if isinstance(msg, HumanMessage) else "ai", "content": msg.content}
                   for msg in history.messages], f, indent=2)
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

# WebSocket API for Chatbot
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
                    prompt = ChatPromptTemplate.from_messages([("system", "You are a career counselor, specializing in attracting learners towards their studies. "
                                   "Ask the user how they want to attract their life towards studies. "
                                   "Write a dialogue or narrative where you discuss their motivations, skills, and goals within this field. "
                                   "Offer personalized guidance, outlining potential career paths, necessary skills or qualifications, and practical steps they can take to achieve their aspirations. If the user gives you a prompt in Hindi or Marathi, you should respond in Hindi or Marathi respectively. BUT THE INITIAL RESPONSE SHOULD ALWAYS BE IN ENGLISH"),
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
                        config={"configurable": {"session_id": session_id}} 
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
            print("WebSocket already closed; unable to send chat log.")
    finally:
        # Ensure cleanup
        manager.disconnect(session_id)

# Helper functions
def count_syllables(word):
    return len(re.findall(r'[aeiouy]+', word.lower()))  # Approximate syllable count based on vowels

def simple_tokenize(text):
    """A basic tokenization method to split text into words."""
    return re.findall(r'\b\w+\b', text.lower())

def analyze_articulation_rate(text, duration_seconds):
    words = simple_tokenize(text)
    total_syllables = sum(count_syllables(word) for word in words)
    articulation_rate = total_syllables / duration_seconds
    return articulation_rate

def analyze_speech_rate(text, duration_seconds):
    word_count = len(simple_tokenize(text))
    speech_rate = word_count / duration_seconds  # Words per second
    return speech_rate

def analyze_communication_skills(text, duration):
    words = simple_tokenize(text)
    word_count = len(words)
    
    try:
        wpm = word_count / (duration / 60)
    except ZeroDivisionError:
        wpm = 0

    filler_words = ['um', 'uh', 'like', 'you know', 'so', 'actually', 'basically', 'I mean']
    filler_count = sum(text.lower().count(word) for word in filler_words)
    
    feedback = []
    if wpm < 120:
        feedback.append('Consider speaking faster to maintain engagement.')
    elif wpm > 160:
        feedback.append('Your speech rate is fast; try slowing down for clarity.')
    else:
        feedback.append('Your speech rate is well-paced.')
    
    if filler_count > 5:
        feedback.append(f'Try to reduce filler words. You used {filler_count} filler words.')
    else:
        feedback.append('Good control over filler words.')

    return feedback

# Endpoint to process video files and extract speech analytics
@app.post("/process_video/")
async def process_video(file: UploadFile = File(...)):
    try:
        # Create uploads folder if it doesn't exist
        if not os.path.exists('uploads'):
            os.makedirs('uploads')
        
        video_file = f"uploads/{file.filename}"
        
        # Save the uploaded video file in chunks to prevent memory overflow
        with open(video_file, "wb") as f:
            while content := await file.read(1024):  # Read in chunks of 1024 bytes
                f.write(content)

        # Extract audio from video and analyze it
        video = VideoFileClip(video_file)
        audio = video.audio
        audio_file = video_file.replace('.mp4', '.wav')
        audio.write_audiofile(audio_file)

        recognizer = sr.Recognizer()
        with sr.AudioFile(audio_file) as source:
            audio_data = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio_data)
                # Use video duration for speech analysis
                duration_seconds = video.duration
            except sr.UnknownValueError:
                text = 'Speech was unclear'
                duration_seconds = video.duration  # If speech unclear, just use video duration
            except sr.RequestError:
                text = 'Failed to get results'
                duration_seconds = video.duration

        # Run communication analysis and additional analyses
        communication_feedback = analyze_communication_skills(text, video.duration)
        articulation_rate = analyze_articulation_rate(text, video.duration)
        speech_rate = analyze_speech_rate(text, video.duration)

        # Properly close video and audio resources before deleting files
        video.reader.close()
        video.audio.reader.close_proc()

        # Clean up files
        os.remove(audio_file)
        os.remove(video_file)

        # Return analysis (Speech analytics only)
        return {
            "Transcription": text,
            "Communication Feedback": ', '.join(communication_feedback),
            "Articulation Rate (syllables per second)": articulation_rate,
            "Speech Rate (words per second)": speech_rate
        }

    except Exception as e:
        return {"error": str(e)}

# Start the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Running on port 8000
