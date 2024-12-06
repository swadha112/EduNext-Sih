import React, { useContext, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  Box,
  Alert,
  Paper,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { UserContext } from '../context/UserContext';
import { motion } from 'framer-motion'; // Animation library

const Counselors = () => {
  const theme = useTheme();
  const [address, setAddress] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAffiliated, setShowAffiliated] = useState(false);
  const [points, setPoints] = useState(0);
  const { user } = useContext(UserContext);

  // Get user data from context or localStorage as a fallback
  const userData = user || JSON.parse(localStorage.getItem('user')) || {};

  // Dummy list for counselors affiliated with us
  const affiliatedCounselors = [
    { title: 'Ashish Rathod', avatar: '/assets/ashish-avatar.png', phone: '+917039600864' },
    { title: 'Deepa Kumar', avatar: '/assets/deepa-avatar.png', phone: '+917039600864' },
    { title: 'Sam Stallion', avatar: '/assets/sam-avatar.png', phone: '+917039600864' },
  ];

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setShowAffiliated(true);
    try {
      const response = await fetch('http://localhost:5050/api/counselors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }

      const data = await response.json();
      setCounselors(data);
      setPoints((prev) => prev + 10); // Award points for initiating search
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (phone) => {
    const clientName = userData?.name || 'Aahan Shetye'; // Default to 'Aahan Shetye' if user.name is not available
    const email = userData?.email || 'atharvaupare5@gmail.com'; // Default email
    const bio = userData?.bio || 'I am a 3rd year engineering student'; // Default bio
    console.log(clientName, email, bio);

    setPoints((prev) => prev + 50); // Award points for connecting with counselor
    alert(`Connecting with counselor at ${phone}!`);


    try {
      const response = await fetch(
        'http://localhost:5050/api/whatsapp/send-whatsapp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: phone,
            clientName,
            email,
            bio,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send WhatsApp message');
      }

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title with colorful text */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#4A4A4A',
        }}
      >
        🧑‍🏫 Find Your Career Counselor
      </Typography>


      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter your pincode"
            value={address}
            onChange={handleInputChange}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                height: '56px',
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd',
                borderRadius: '12px',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !address}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              height: '56px',
              fontSize: '1rem',
              backgroundColor: '#f7819f', // Fun pink color for button
              '&:hover': {
                backgroundColor: '#f50057', // Darker pink on hover
              },
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Grid>
      </Grid>

      {/* Displaying affiliated counselors in card format */}
      {showAffiliated && (
        <>
          <Typography
            variant="h5"
            sx={{ mt: 5, mb: 2, color: theme.palette.text.primary }}
          >
            🎓 Counsellors Affiliated with Us
          </Typography>

          {/* Counselor Cards */}
          <Grid container spacing={3}>
            {affiliatedCounselors.map((counselor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      height: '350px', // Fixed height for uniformity
                      borderRadius: '16px',
                      boxShadow: 2,
                      backgroundColor: theme.palette.background.paper,
                      '&:hover': {
                        boxShadow: 10,
                      },
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', paddingBottom: '10px' }}>
                      <Avatar
                        src={counselor.avatar}
                        alt={counselor.title}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          border: `3px solid ${theme.palette.primary.main}`,
                        }}
                      />
                      <Typography variant="h6">{counselor.title}</Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        Career Guidance & Support
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{
                        justifyContent: 'center',
                        pb: 2,
                      }}
                    >
                      <Tooltip title="Click to connect with counselor" arrow>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: '#1e88e5',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#1565c0',
                            },
                          }}
                          onClick={() => handleConnect(counselor.phone)}
                        >
                          💬 Connect
                        </Button>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* API Counselors List */}
      {counselors.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            💼 Available Counselors Near You
          </Typography>
          <Grid container spacing={3}>
            {counselors.map((counselor, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: '12px', boxShadow: 2, height: '250px' }}>
                  <CardContent>
                    <Typography variant="h6">{counselor.title}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Career Specialist
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', pb: 2 }}>
                    <Button
                      variant="outlined"
                      sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: '#fff',
                        },
                      }}
                      href={counselor.url}
                      target="_blank"
                    >
                      Visit Website
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: theme.palette.primary.main,
                        borderColor: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main,
                          color: '#fff',
                        },
                      }}
                      href={counselor.maps_link}
                      target="_blank"
                    >
                      View on Google Maps
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default Counselors;
