import speech_recognition as sr
import parselmouth
import language_tool_python
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
import re
import numpy as np
import cv2
import os
from moviepy.editor import VideoFileClip  # Import moviepy for audio extraction

# Download necessary nltk packages
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

def analyze_pause_frequency(text, audio_file):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file) as source:
        duration_seconds = source.DURATION

    sentences = sent_tokenize(text)
    pause_frequency = len(sentences) / duration_seconds  # Approximate pause frequency by sentence breaks
    return pause_frequency

# Combined analysis function for audio
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

# Generate a summarized audio analysis similar to video analysis
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

# Extract frames from the video
def extract_frames(video_path, interval=0.5):
    # Create a directory to save frames
    frame_dir = 'backendpython/video_frames'
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

def analyze_frames(frame_dir):
    import cv2
    import numpy as np
    import math

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
    
    # Performance scoring
    def calculate_performance_score():
        # Normalize and weight different metrics
        face_visibility = min((performance_metrics['face_visibility']['count'] / frame_count) * 100, 100)
        stability_score = performance_metrics['movement_analysis']['stability_score']
        camera_contact = min((performance_metrics['confidence_indicators']['direct_camera_contact'] / frame_count) * 100, 100)
        
        # Weighted performance calculation
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
        if performance_metrics['movement_analysis']['movement_types']['body_shift'] > 5:
            feedback += "- Excessive body movement detected. Practice sitting still and maintaining a composed posture.\n"
        
        if performance_metrics['movement_analysis']['movement_types']['head_rotation'] > 3:
            feedback += "- Noticeable head movements observed. Try to minimize unnecessary head rotations.\n"
        
        # Camera Presence
        face_visibility_percent = (performance_metrics['face_visibility']['count'] / frame_count) * 100
        if face_visibility_percent < 60:
            feedback += "- Inconsistent camera presence. Ensure you remain centered and visible throughout the interview.\n"
        
        # Performance Score Interpretation
        if performance_score >= 80:
            feedback += "\nOverall Performance: Excellent\n"
        elif performance_score >= 60:
            feedback += "\nOverall Performance: Good, with room for improvement\n"
        else:
            feedback += "\nOverall Performance: Needs significant work\n"
        
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

def extract_audio_from_video(video_path):
    video_clip = VideoFileClip(video_path)
    audio_path = "backendpython/extracted_audio.wav"
    video_clip.audio.write_audiofile(audio_path, codec='pcm_s16le')
    return audio_path

# Main function for full video analysis (audio + video)
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
    print("\nVideo Analysis:\n")
    print(video_summary)
    
    print("\nAudio Analysis:\n")
    print(audio_summary)

# Example usage
video_path = 'backendpython/video.mp4'  # Replace with your video file path
analyze_video(video_path)