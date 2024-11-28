from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from moviepy.editor import VideoFileClip
import speech_recognition as sr
import re
import os

# Initialize FastAPI app
app = FastAPI()

# Set up CORS so that your frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            except sr.UnknownValueError:
                text = 'Speech was unclear'
            except sr.RequestError:
                text = 'Failed to get results'
            duration_seconds = source.DURATION

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
    uvicorn.run(app, host="0.0.0.0", port=8001)  # Running on port 8001


## extra commit to show that Aahan's did work on the ML Part on google colab files
## which were then converted to .py files to add to the website