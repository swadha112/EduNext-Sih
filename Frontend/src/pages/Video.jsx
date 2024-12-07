import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Container } from '@mui/material';
import Swal from 'sweetalert2';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null); // Separate state for audio analysis
  const [videoAnalysis, setVideoAnalysis] = useState(null); // Separate state for video analysis

  // Callback when file is dropped
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setVideoFile(acceptedFiles[0]); // Save the dropped video file
    }
  }, []);

  // Configure the dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/ogg': ['.ogg'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!videoFile) {
      Swal.fire({
        icon: 'error',
        title: 'No file selected',
        text: 'Please select or drop a video file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', videoFile); // Use 'file' key to match FastAPI backend

    // Show loading Swal
    Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while we process your video.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch('http://localhost:8000/process_video/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log the response data

      // Store audio and video analysis separately
      const audio = responseData.audio_analysis;
      const video = responseData.video_analysis;

      setAudioAnalysis(audio); // Store audio analysis
      setVideoAnalysis(video); // Store video analysis

      // Close the loader and show success with auto close in 1 second
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Your video has been successfully processed.',
        timer: 1000, // Auto close after 1 second (1000 ms)
        timerProgressBar: true, // Show a progress bar for the timer
        showConfirmButton: false, // Hide the confirm button
      });
    } catch (error) {
      console.error('Error uploading video:', error);

      // Show error Swal
      Swal.fire({
        icon: 'error',
        title: 'Upload failed',
        text: 'Failed to upload video. Please try again.',
      });
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload a Video for Speech and Video Analysis
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #888',
          padding: '20px',
          textAlign: 'center',
          margin: '20px 0',
          cursor: 'pointer',
          borderRadius: '8px',
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography variant="body1">Drop the video here...</Typography>
        ) : (
          <Typography variant="body1">
            Drag & drop a video here, or click to select one
          </Typography>
        )}
      </Box>

      {videoFile && (
        <Typography variant="subtitle1" sx={{ marginBottom: '20px' }}>
          Selected file: {videoFile.name}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginBottom: '20px' }}
        disabled={!videoFile}
      >
        Upload and Analyze
      </Button>

      {/* Display Audio Analysis */}
      {audioAnalysis && (
        <Box>
          <Typography variant="h3" gutterBottom>
            Todo: Beautiy this output
          </Typography>{' '}
          <Typography variant="h5" gutterBottom>
            Audio Analysis Results
          </Typography>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography>{audioAnalysis}</Typography>
          </Box>
        </Box>
      )}

      {/* Display Video Analysis */}
      {videoAnalysis && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Video Analysis Results
          </Typography>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography>{videoAnalysis}</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default UploadVideo;
