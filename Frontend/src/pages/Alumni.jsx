import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  Grid,
  Link,
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
      {/* Title with custom lemon green color */}
      <Typography
        variant="h3"
        align="left"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#ADFF2F', // Lemon green color
          ml: 1, // Reduced left padding
          fontSize: '2.5rem', // Increased font size
        }}
      >
        Alumni Information
      </Typography>

      <Grid container spacing={3} justifyContent="flex-start">
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter University Name"
            value={universityName}
            onChange={handleInputChange}
            disabled={loading}
            InputProps={{
              sx: {
                backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#d3d3d3', // White in dark mode, grey in light mode
                borderRadius: '8px', // Rounded corners for search box
              },
            }}
            sx={{
              mb: 2,
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

      {/* Display results in a table */}
      {alumniData.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 5, borderRadius: 3, p: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem', padding: '16px' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem', padding: '16px' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem', padding: '16px' }}>University</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem', padding: '16px' }}>LinkedIn Profile</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumniData.map((alumni, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}>{alumni.name}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}>{alumni.university_name}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem', padding: '16px' }}>
                    <Link href={alumni.linkedin_link} target="_blank" rel="noopener noreferrer">
                      LinkedIn Profile
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Alumni;
