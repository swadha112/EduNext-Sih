from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from moviepy.editor import *
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
from dotenv import load_dotenv

# Initialize FastAPI app
load_dotenv()
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
google_api_key = os.getenv("GOOGLE_API_KEY")

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

import parselmouth
import numpy as np
import language_tool_python
from nltk.tokenize import word_tokenize, sent_tokenize

def analyze_pitch(audio_file):
    sound = parselmouth.Sound(audio_file)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    pitch_values = pitch_values[pitch_values != 0]  # Remove unvoiced parts (where frequency is 0)
    
    avg_pitch = np.mean(pitch_values)
    pitch_range = np.max(pitch_values) - np.min(pitch_values)
    return avg_pitch, pitch_range

def analyze_grammar(text):
    tool = language_tool_python.LanguageTool('en-US')
    matches = tool.check(text)
    grammar_issues = len(matches)
    return grammar_issues, matches

def analyze_vocabulary_richness(text):
    words = word_tokenize(text)
    unique_words = set(words)
    ttr = len(unique_words) / len(words)  # Type-Token Ratio
    return ttr, len(unique_words), len(words)

def analyze_pause_frequency(text, audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        duration_seconds = source.DURATION

    sentences = sent_tokenize(text)
    pause_frequency = len(sentences) / duration_seconds  # Approximate pause frequency by sentence breaks
    return pause_frequency



def analyze_speech(audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        audio = recognizer.record(source)
        text = recognizer.recognize_google(audio)
        duration_seconds = source.DURATION  # Audio length in seconds
    
    # Run all analyses
    avg_pitch, pitch_range = analyze_pitch(audio_file)
    articulation_rate = analyze_articulation_rate(text, duration_seconds)
    grammar_issues, grammar_matches = analyze_grammar(text)
    ttr, unique_word_count, total_word_count = analyze_vocabulary_richness(text)
    speech_rate = analyze_speech_rate(text, duration_seconds)
    pause_frequency = analyze_pause_frequency(text, audio_file)

    # Return results
    results = {
        "Recognized Text": text,
        "Average Pitch": avg_pitch,
        "Pitch Range": pitch_range,
        "Articulation Rate (syllables per second)": articulation_rate,
        "Grammar Issues": grammar_issues,
        "Vocabulary Richness (TTR)": ttr,
        "Unique Word Count": unique_word_count,
        "Total Word Count": total_word_count,
        "Speech Rate (words per second)": speech_rate,
        "Pause Frequency (pauses per second)": pause_frequency
    }
    
    return results

def generate_audio_summary(analysis_results):
    recognized_text = analysis_results.get("Recognized Text", "Not Available")
    avg_pitch = analysis_results.get("Average Pitch", 0)
    pitch_range = analysis_results.get("Pitch Range", 0)
    articulation_rate = analysis_results.get("Articulation Rate (syllables per second)", 0)
    grammar_issues = analysis_results.get("Grammar Issues", 0)
    vocabulary_richness = analysis_results.get("Vocabulary Richness (TTR)", 0)
    unique_word_count = analysis_results.get("Unique Word Count", 0)
    total_word_count = analysis_results.get("Total Word Count", 0)
    speech_rate = analysis_results.get("Speech Rate (words per second)", 0)
    pause_frequency = analysis_results.get("Pause Frequency (pauses per second)", 0)

    summary = f"The provided speech was recognized as follows:\n'{recognized_text}'.\n\n"
    summary += f"Key insights from the audio analysis include:\n\n"
    
    # Pitch Analysis
    summary += f"- Average Pitch: The speaker's average pitch was around {avg_pitch:.2f} Hz, "
    summary += f"with a pitch range of {pitch_range:.2f} Hz, indicating some variations in tone.\n"
    
    # Articulation Rate
    summary += f"- Articulation Rate: The speaker articulated at a rate of {articulation_rate:.2f} syllables per second, "
    summary += f"which indicates a moderate pace of speech.\n"
    
    # Grammar Issues
    summary += f"- Grammar Issues: There were {grammar_issues} grammar issues detected, which may suggest areas for improvement in language clarity.\n"
    
    # Vocabulary Richness
    summary += f"- Vocabulary Richness (TTR): The vocabulary richness, measured by Type-Token Ratio (TTR), was {vocabulary_richness:.2f}, "
    summary += f"with {unique_word_count} unique words out of {total_word_count} total words, showing a varied vocabulary.\n"
    
    # Speech Rate
    summary += f"- Speech Rate: The speech rate was {speech_rate:.2f} words per second, which reflects a moderate, listener-friendly pace.\n"
    
    # Pause Frequency
    summary += f"- Pause Frequency: The speaker paused at a frequency of {pause_frequency:.2f} pauses per second, "
    summary += f"indicating a steady flow of speech with occasional breaks.\n"

    # General Feedback
    summary += "\nOverall Feedback:\n"
    summary += "The speaker maintained a consistent and engaging tone with a natural variation in pitch. "
    summary += "However, there are minor grammatical issues that could be refined for clearer communication. "
    summary += "The vocabulary usage was rich, and the pace of speech was balanced, making the content easy to follow. "
    summary += "Improving articulation and addressing pauses strategically could further enhance the quality of speech delivery."

    return summary

import cv2

def extract_frames(video_path, interval=0.5):
    # Create a directory to save frames
    frame_dir = 'uploads/video_frames/'
    os.makedirs(frame_dir, exist_ok=True)
    
    # Capture video
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    
    count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        # Capture frame every 'interval' seconds
        if count % int(fps * interval) == 0:
            frame_path = os.path.join(frame_dir, f'frame_{count // int(fps * interval)}.jpg')
            cv2.imwrite(frame_path, frame)
        
        count += 1
    
    cap.release()
    return frame_dir


def extract_audio_from_video(video_path):
    video_clip = VideoFileClip(video_path)
    audio_path = "uploads/extracted_audio.wav"
    video_clip.audio.write_audiofile(audio_path, codec='pcm_s16le')
    return audio_path

import os
import cv2
import numpy as np
import math

import os
import cv2
import numpy as np
import math

import os
import cv2
import numpy as np
import math

import os
import cv2
import numpy as np
import math

def analyze_frames(frame_dir):
    # Comprehensive interview performance metrics
    performance_metrics = {
        'face_visibility': {'count': 0, 'consistency': 0},
        'movement_analysis': {
            'total_movement': 0,
            'stability_score': 100,
            'movement_types': {
                'head_rotation': 0,
                'body_shift': 0,
                'minor_adjustments': 0
            }
        },
        'confidence_indicators': {
            'direct_camera_contact': 0,
            'posture_stability': 0,
            'facial_expressions': {
                'neutral': 0,
                'engaged': 0,
                'nervous': 0
            }
        }
    }

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Previous frame for movement tracking
    prev_faces = None
    frame_count = 0

    for frame_file in sorted(os.listdir(frame_dir)):
        frame_path = os.path.join(frame_dir, frame_file)
        try:
            frame = cv2.imread(frame_path)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # Face detection
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            # Update face visibility
            performance_metrics['face_visibility']['count'] += len(faces)
            
            # Movement analysis
            if prev_faces is not None and len(faces) > 0:
                # Calculate movement based on face position changes
                for (x1, y1, w1, h1) in prev_faces:
                    for (x2, y2, w2, h2) in faces:
                        movement = math.sqrt((x2-x1)**2 + (y2-y1)**2)
                        
                        # Categorize movement
                        if movement > 50:
                            performance_metrics['movement_analysis']['total_movement'] += 1
                            performance_metrics['movement_analysis']['movement_types']['body_shift'] += 1
                            performance_metrics['movement_analysis']['stability_score'] -= 10
                        elif movement > 20:
                            performance_metrics['movement_analysis']['movement_types']['head_rotation'] += 1
                            performance_metrics['movement_analysis']['stability_score'] -= 5
                        else:
                            performance_metrics['movement_analysis']['movement_types']['minor_adjustments'] += 1
            
            # Confidence indicators
            if len(faces) > 0:
                # Simulate facial expression detection (simplified)
                performance_metrics['confidence_indicators']['direct_camera_contact'] += 1
                performance_metrics['confidence_indicators']['facial_expressions']['neutral'] += 1
            
            prev_faces = faces
            frame_count += 1
        
        except Exception as e:
            print(f"Frame analysis error: {e}")
    
    # Normalize and weight different metrics
    def normalize_percentage(value, max_value):
        return min(max((value / max_value) * 100, 0), 100) if max_value > 0 else 0  # Protect against zero division

    def normalize_stability_score(stability_score):
        return min(max(stability_score, 0), 100)  # Stability score cannot be negative

    # Performance scoring
    def calculate_performance_score():
        face_visibility = normalize_percentage(performance_metrics['face_visibility']['count'], frame_count)
        stability_score = normalize_stability_score(performance_metrics['movement_analysis']['stability_score'])
        camera_contact = normalize_percentage(performance_metrics['confidence_indicators']['direct_camera_contact'], frame_count)
        
        # Weighted performance calculation with additional tiers
        performance_score = (
            (face_visibility * 0.3) + 
            (stability_score * 0.4) + 
            (camera_contact * 0.3)
        )
        
        return performance_score

    # Detailed performance interpretation
    performance_score = calculate_performance_score()

    def generate_detailed_feedback():
        feedback = "Interview Performance Insights:\n\n"
        
        # Movement Analysis
        body_shift = performance_metrics['movement_analysis']['movement_types']['body_shift']
        head_rotation = performance_metrics['movement_analysis']['movement_types']['head_rotation']
        
        # Body Shift Analysis
        if body_shift > 10:
            feedback += "- Significant body movement detected. It's important to remain still to convey confidence.\n"
        elif body_shift > 5:
            feedback += "- Moderate body movement detected. Try to practice sitting still.\n"
        else:
            feedback += "- Minimal body movement detected. Excellent posture!\n"
        
        # Head Rotation Analysis
        if head_rotation > 5:
            feedback += "- Excessive head rotation detected. This may indicate nervousness. Try to minimize head movements.\n"
        elif head_rotation > 3:
            feedback += "- Moderate head rotation observed. Aim to keep your head steady.\n"
        else:
            feedback += "- Minimal head movement. Great job in maintaining focus!\n"
        
        # Camera Presence
        face_visibility_percent = normalize_percentage(performance_metrics['face_visibility']['count'], frame_count)
        if face_visibility_percent < 40:
            feedback += "- Poor camera presence. Ensure you're well-centered and visible.\n"
        elif face_visibility_percent < 60:
            feedback += "- Inconsistent camera presence. Ensure you're clearly visible during the entire interview.\n"
        elif face_visibility_percent < 80:
            feedback += "- Good camera presence. Keep up the visibility, but try to stay centered.\n"
        else:
            feedback += "- Excellent camera presence. You're always in frame and clearly visible.\n"
        
        # Camera Contact
        if performance_metrics['confidence_indicators']['direct_camera_contact'] < 0.5 * frame_count:
            feedback += "- Low direct camera contact. This may indicate a lack of engagement.\n"
        elif performance_metrics['confidence_indicators']['direct_camera_contact'] < 0.7 * frame_count:
            feedback += "- Moderate camera contact. Try to keep your focus on the camera more often.\n"
        else:
            feedback += "- Excellent direct camera contact. You appear engaged and focused.\n"
        
        # Performance Score Interpretation
        if performance_score >= 90:
            feedback += "\nOverall Performance: Outstanding\n"
        elif performance_score >= 80:
            feedback += "\nOverall Performance: Excellent\n"
        elif performance_score >= 70:
            feedback += "\nOverall Performance: Good, with room for improvement\n"
        elif performance_score >= 60:
            feedback += "\nOverall Performance: Average, needs significant improvement\n"
        else:
            feedback += "\nOverall Performance: Needs substantial work\n"
        
        return feedback

    # Final summary
    summary = (
        f"Interview Video Analysis\n"
        f"Performance Score: {performance_score:.2f}/100\n"
        f"{generate_detailed_feedback()}"
        "\nTips for Improvement:\n"
        "- Maintain steady posture\n"
        "- Keep consistent eye contact\n"
        "- Minimize unnecessary movements\n"
        "- Stay centered in frame"
    )
    
    return summary


def analyze_video(video_path):
    # Step 1: Extract audio from the video
    audio_file = extract_audio_from_video(video_path)
    
    # Step 2: Perform audio analysis
    analysis_results = analyze_speech(audio_file)
    audio_summary = generate_audio_summary(analysis_results)
    
    # Step 3: Extract frames from the video
    frame_dir = extract_frames(video_path, interval=0.5)  # Extract frames every 0.5 seconds
    
    # Step 4: Perform video analysis (emotion detection)
    video_summary = analyze_frames(frame_dir)

    # Output results
    # print("\nVideo Analysis:\n")
    # print(video_summary)
    
    # print("\nAudio Analysis:\n")
    # print(audio_summary)
      
    return {
        "video_analysis": video_summary,
        "audio_analysis": audio_summary
    }


from fastapi.responses import JSONResponse

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

        video_path = f"uploads/{file.filename}"
        analysis_results = analyze_video(video_path)


      
        
        return JSONResponse(content=analysis_results)


      

    except Exception as e:
        return {"error": str(e)}





# Start the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Running on port 8000
