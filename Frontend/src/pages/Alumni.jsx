import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Alumni = () => {
  const theme = useTheme(); // Access the current theme (light or dark)
  const [universityName, setUniversityName] = useState('');
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setUniversityName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5050/api/alumni', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ universityName }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alumni information.');
      }

      const data = await response.json();
      setAlumniData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title with custom dark grey color */}
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: theme.palette.mode === 'dark' ? 'black' : 'white', // Set the title color to dark grey
        }}
      >
        Alumni Information
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter University Name"
            value={universityName}
            onChange={handleInputChange}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                height: '56px', // Ensuring the input height matches the button height
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd', // Custom background for dark mode
                borderRadius: '8px', // Rounded corners for search box
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'dark' ? '#90caf9' : '#1e88e5', // Custom label color for dark/light mode
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor:
                  theme.palette.mode === 'dark' ? '#90caf9' : '#1e88e5', // Border color based on theme
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                {
                  borderColor:
                    theme.palette.mode === 'dark' ? '#42a5f5' : '#1565c0', // Focus border color for dark/light mode
                },
              color: theme.palette.text.primary, // Adjust text color based on the theme
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !universityName}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              height: '56px', // Matching the button height with the input field
              fontSize: '1rem', // Ensuring font size is clear and readable
              backgroundColor:
                theme.palette.mode === 'dark' ? '#f7819f' : '#3f51b5', // Button background based on theme
              color: theme.palette.mode === 'dark' ? '#fff' : '#fff', // Button text color based on theme
              '&:hover': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#303f9f' : '#303f9f', // Hover state background color
              },
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3, mb: 3 }}>
          {error}
        </Alert>
      )}

      {alumniData.length > 0 && (
        <Paper
          sx={{
            mt: 5,
            p: 5, // Increase padding for more spacing
            width: '100%', // Occupy full width of the container
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            Alumni List
          </Typography>
          <List>
            {alumniData.map((alumni, index) => (
              <ListItem key={index} sx={{ mb: 3 }}>
                <ListItemText
                  primary={alumni.name}
                  secondary={alumni.university_name}
                  primaryTypographyProps={{
                    fontSize: '1.3rem', // Slightly reduced font size
                    fontWeight: 'bold',
                    color:
                      theme.palette.mode === 'dark' ? '#f7819f' : '#3f51b5', // Custom color for name
                  }}
                  secondaryTypographyProps={{
                    fontSize: '1rem', // Slightly reduced font size for university
                    color: theme.palette.text.secondary,
                  }}
                />
                <Typography
                  variant="body1"
                  component="a"
                  href={alumni.linkedin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    ml: 2,
                    fontSize: '1.1rem',
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  LinkedIn Profile
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default Alumni;
