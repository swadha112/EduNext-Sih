import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  Paper,
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SchoolIcon from '@mui/icons-material/School';

const Quiz = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    profession: '',
    interests: '',
    hobbies: '',
    experience: '',
    dob: '',
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5050/api/quiz/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userInfo,
          interests: userInfo.interests.split(','),
          hobbies: userInfo.hobbies.split(','),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ py: 6, px: 5, backgroundColor: '#A7BED3', borderRadius: 3 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 3 }}>
          Career Quiz for Students
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: '#353B3C', mb: 5 }}>
          <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Let's explore your career interests!
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Profession"
                name="profession"
                value={userInfo.profession}
                onChange={handleChange}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Interests (comma-separated)"
                name="interests"
                value={userInfo.interests}
                onChange={handleChange}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hobbies (comma-separated)"
                name="hobbies"
                value={userInfo.hobbies}
                onChange={handleChange}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience"
                name="experience"
                value={userInfo.experience}
                onChange={handleChange}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                name="dob"
                value={userInfo.dob}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmojiObjectsIcon />}
                sx={{
                  height: '56px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: '#353B3C',
                  '&:hover': {
                    backgroundColor: '#f7819f', // Slightly darker shade for hover
                  },
                }}
              >
                {loading ? 'Generating...' : 'Start Quiz'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {questions.length > 0 && (
          <Card sx={{ backgroundColor: '#F89DB0', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#00796b', fontWeight: 'bold' }}>
                Answer the following questions:
              </Typography>
              {questions.map((question, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#004d40', fontSize: '1.1rem' }}>
                    {question}
                  </Typography>
                  <TextField
                    fullWidth
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder="Your answer"
                    sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default Quiz;
