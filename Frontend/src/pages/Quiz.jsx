import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
  Paper,
  Card,
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import SchoolIcon from '@mui/icons-material/School';
import { styled } from '@mui/system';

// Styled components for minimalistic, clean look
const StyledPaper = styled(Paper)({
  padding: '40px 30px',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
});

const HeaderTypography = styled(Typography)({
  fontWeight: 'bold',
  color: '#2D3748',
  marginBottom: '20px',
  textAlign: 'center',
  fontSize: '2rem',
});

const SubHeaderTypography = styled(Typography)({
  color: '#4A5568',
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '1.1rem',
});

const StyledButton = styled(Button)({
  width: '100%',
  height: '50px',
  backgroundColor: '#38B2AC',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '25px',
  '&:hover': {
    backgroundColor: '#319795',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  backgroundColor: 'white',
  borderRadius: '10px',
  '& .MuiInputBase-root': {
    borderRadius: '10px',
  },
});

const QuestionCard = styled(Card)({
  backgroundColor: '#EDF2F7',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '20px',
  marginBottom: '20px',
});

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
  const [step, setStep] = useState(1);  // Step 1: User info, Step 2: Questions, Step 3: Recommendations
  const [recommendations, setRecommendations] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);  // Track current question index

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  // Submit user info to the backend and get questions
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
      setStep(2);  // Move to question-answering step
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the submission of an answer
  const handleAnswerSubmit = () => {
    setLoading(true);

    // Store the answer and go to the next question
    setAnswers([...answers, answers[currentQuestionIndex]]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);  // Move to next question

    // If all questions are answered, get recommendations
    if (currentQuestionIndex + 1 === questions.length) {
      getRecommendations();
    } else {
      setLoading(false);
    }
  };

  // Get recommendations after answering all questions
  const getRecommendations = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/quiz/recommend-subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendedSubjects);
      setStep(3);  // Move to recommendations step
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper>
        <HeaderTypography variant="h4">Career Quiz for Students</HeaderTypography>
        <SubHeaderTypography variant="h6">
          <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Let's explore your career interests!
        </SubHeaderTypography>

        {step === 1 && (
          <Box component="form" onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Full Name"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Profession"
              name="profession"
              value={userInfo.profession}
              onChange={handleChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Interests (comma-separated)"
              name="interests"
              value={userInfo.interests}
              onChange={handleChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Hobbies (comma-separated)"
              name="hobbies"
              value={userInfo.hobbies}
              onChange={handleChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Experience"
              name="experience"
              value={userInfo.experience}
              onChange={handleChange}
              required
            />
            <StyledTextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dob"
              value={userInfo.dob}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
            <StyledButton
              type="submit"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmojiObjectsIcon />}
            >
              {loading ? 'Generating...' : 'Start Quiz'}
            </StyledButton>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {step === 2 && questions.length > 0 && currentQuestionIndex < questions.length && (
          <Box>
            <QuestionCard>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                {questions[currentQuestionIndex]}
              </Typography>
              <StyledTextField
                fullWidth
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer"
              />
            </QuestionCard>
            <StyledButton
              variant="contained"
              onClick={handleAnswerSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Next Question'}
            </StyledButton>
          </Box>
        )}

        {step === 3 && recommendations.length > 0 && (
          <Card sx={{ backgroundColor: '#EDF2F7', padding: '20px', borderRadius: '12px' }}>
            <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>
              Based on your answers, you might be interested in the following subjects:
            </Typography>
            <ul>
              {recommendations.map((subject, index) => (
                <li key={index}>
                  <Typography variant="body1" sx={{ color: '#333' }}>
                    {subject}
                  </Typography>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </StyledPaper>
    </Container>
  );
};

export default Quiz;
