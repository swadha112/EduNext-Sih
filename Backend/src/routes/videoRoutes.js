const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const router = express.Router();

// Configure Multer for video uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/video/upload
router.post('/upload', upload.single('video'), async (req, res) => {
    const videoPath = req.file.path;

    try {
        // Prepare the form data to send to the FastAPI server (main2.py)
        const form = new FormData();
        form.append('file', fs.createReadStream(videoPath), req.file.originalname);

        // Send the video to FastAPI server running on port 8001
        const response = await axios.post('http://localhost:8001/process_video/', form, {
            headers: form.getHeaders(),
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        // Ensure a valid JSON response is returned from FastAPI
        if (response && response.data) {
            res.json(response.data);  // Send analysis result back to client
        } else {
            res.status(500).json({ error: 'Invalid response from FastAPI server' });
        }
    } catch (error) {
        console.error('Error processing video:', error.message);
        res.status(500).json({ error: 'Failed to process video' });
    } finally {
        // Clean up the uploaded file
        fs.unlink(videoPath, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
        });
    }
});

module.exports = router;
