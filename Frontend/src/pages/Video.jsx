import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, Container } from '@mui/material';
import Swal from 'sweetalert2';

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const optimalArticulationRate = 4.5; // Good range could be around 4.0 - 5.0 syllables/second
  const optimalSpeechRate = 150; // Good range could be around 120-160 words/minute

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
      const response = await fetch('http://localhost:8001/process_video/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload video');
      }

      const data = await response.json();
      setAnalysis(data); // Set the analysis result

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

  // Determine emoji based on optimal articulation rate
  const getArticulationRateEmoji = (rate) => {
    if (rate >= 4.0 && rate <= 5.0) return '✅';
    if ((rate > 3.0 && rate < 4.0) || (rate > 5.0 && rate < 6.0)) return '⚠️';
    return '❌';
  };

  // Determine emoji based on optimal speech rate
  const getSpeechRateEmoji = (rate) => {
    if (rate >= 120 && rate <= 160) return '✅';
    if ((rate >= 100 && rate < 120) || (rate > 160 && rate <= 180)) return '⚠️';
    return '❌';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Upload a Video for Speech Analysis
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

      {analysis && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Analysis Results
          </Typography>

          <Typography>
            <strong>Transcription:</strong> {analysis['Transcription']}
          </Typography>
          <Typography>
            <strong>Communication Feedback:</strong>{' '}
            {analysis['Communication Feedback']}
          </Typography>

          <Typography>
            <strong>Articulation Rate (syllables per second):</strong>{' '}
            {analysis['Articulation Rate (syllables per second)']}{' '}
            {getArticulationRateEmoji(
              analysis['Articulation Rate (syllables per second)'],
            )}
          </Typography>

          <Typography>
            <strong>Speech Rate (words per second):</strong>{' '}
            {analysis['Speech Rate (words per second)']}{' '}
            {getSpeechRateEmoji(analysis['Speech Rate (words per second)'])}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default UploadVideo;
