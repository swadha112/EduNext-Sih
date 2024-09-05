import sys
import speech_recognition as sr
from moviepy.editor import VideoFileClip
import parselmouth
import language_tool_python
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
import re
import numpy as np
import os

# Download NLTK data if necessary
nltk.download('punkt')

# Helper functions
def count_syllables(word):
    return len(re.findall(r'[aeiouy]+', word.lower()))  # Approximate syllable count based on vowels

def analyze_pitch(audio_file):
    sound = parselmouth.Sound(audio_file)
    pitch = sound.to_pitch()
    pitch_values = pitch.selected_array['frequency']
    pitch_values = pitch_values[pitch_values != 0]  # Remove unvoiced parts (where frequency is 0)
    
    avg_pitch = np.mean(pitch_values)
    pitch_range = np.max(pitch_values) - np.min(pitch_values)
    return avg_pitch, pitch_range

def analyze_articulation_rate(text, duration_seconds):
    words = word_tokenize(text)
    total_syllables = sum(count_syllables(word) for word in words)
    articulation_rate = total_syllables / duration_seconds
    return articulation_rate

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

def analyze_speech_rate(text, duration_seconds):
    word_count = len(word_tokenize(text))
    speech_rate = word_count / duration_seconds  # Words per second
    return speech_rate

def analyze_pause_frequency(text, duration_seconds):
    sentences = sent_tokenize(text)
    pause_frequency = len(sentences) / duration_seconds  # Approximate pause frequency by sentence breaks
    return pause_frequency

# Existing analysis function (slightly modified to include new features)
def analyze_communication_skills(text, duration):
    words = word_tokenize(text)
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

# Combined function to analyze video (and now includes the new features)
def process_video(video_file):
    try:
        # Extract audio from video
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
            duration_seconds = source.DURATION  # Audio length in seconds

        # Run basic communication skills analysis
        communication_feedback = analyze_communication_skills(text, video.duration)

        # Run additional analyses (new features)
        avg_pitch, pitch_range = analyze_pitch(audio_file)
        articulation_rate = analyze_articulation_rate(text, video.duration)
        grammar_issues, _ = analyze_grammar(text)
        ttr, unique_word_count, total_word_count = analyze_vocabulary_richness(text)
        speech_rate = analyze_speech_rate(text, video.duration)
        pause_frequency = analyze_pause_frequency(text, video.duration)

        # Clean up the audio file
        os.remove(audio_file)

        # Return a full report of analysis
        result = {
            "Transcription": text,
            "Communication Feedback": ', '.join(communication_feedback),
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

        return result
    except Exception as e:
        return f"Error processing video: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        video_file_path = sys.argv[1]

        # Process the video and return the analysis
        result = process_video(video_file_path)

        # Print the result (this will be captured by Node.js)
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print("No video file provided.")
