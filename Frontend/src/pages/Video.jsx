import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const UploadVideo = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    // Callback when file is dropped
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setVideoFile(acceptedFiles[0]);  // Save the dropped video file
        }
    }, []);

    // Configure the dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'video/mp4': ['.mp4'],
            'video/webm': ['.webm'],
            'video/ogg': ['.ogg']
        },
        maxFiles: 1
    });

    const handleUpload = async () => {
        if (!videoFile) {
            alert('Please select or drop a video file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);

        try {
            const response = await fetch('/api/video/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload video');
            }

            const data = await response.json();

            if (data) {
                setAnalysis(data);  // Set the analysis result
            } else {
                alert('Video processing failed');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            alert('Error uploading video');
        }
    };

    return (
        <div>
            <h1>Upload a Video for Speech Analysis</h1>

            <div
                {...getRootProps()}
                style={{
                    border: '2px dashed #888',
                    padding: '20px',
                    textAlign: 'center',
                    margin: '20px 0',
                    cursor: 'pointer'
                }}
            >
                <input {...getInputProps()} />
                {
                    isDragActive
                        ? <p>Drop the video here...</p>
                        : <p>Drag & drop a video here, or click to select one</p>
                }
            </div>

            {videoFile && (
                <div>
                    <p>Selected file: {videoFile.name}</p>
                </div>
            )}

            <button onClick={handleUpload}>Upload and Analyze</button>

            {analysis && (
                <div>
                    <h2>Analysis Results</h2>
                    <div>
                        <p><strong>Transcription:</strong> {analysis['Transcription']}</p>
                        <p><strong>Communication Feedback:</strong> {analysis['Communication Feedback']}</p>
                        <p><strong>Average Pitch:</strong> {analysis['Average Pitch']} Hz</p>
                        <p><strong>Pitch Range:</strong> {analysis['Pitch Range']} Hz</p>
                        <p><strong>Articulation Rate (syllables per second):</strong> {analysis['Articulation Rate (syllables per second)']}</p>
                        <p><strong>Grammar Issues:</strong> {analysis['Grammar Issues']}</p>
                        <p><strong>Vocabulary Richness (TTR):</strong> {analysis['Vocabulary Richness (TTR)']}</p>
                        <p><strong>Unique Word Count:</strong> {analysis['Unique Word Count']}</p>
                        <p><strong>Total Word Count:</strong> {analysis['Total Word Count']}</p>
                        <p><strong>Speech Rate (words per second):</strong> {analysis['Speech Rate (words per second)']}</p>
                        <p><strong>Pause Frequency (pauses per second):</strong> {analysis['Pause Frequency (pauses per second)']}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadVideo;
