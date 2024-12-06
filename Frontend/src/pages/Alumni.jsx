import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Box,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';

const Alumni = () => {
  const theme = useTheme();
  const [universityName, setUniversityName] = useState('');
  const [alumniData, setAlumniData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleInputChange = (e) => {
    setUniversityName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');
    setAlumniData([]);
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
      setSuccessMessage('Awesome! We found your alumni!');
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, backgroundColor: '#e3f2fd', borderRadius: 3 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#0277bd',
          fontSize: '2.5rem',
          mb: 4,
        }}
      >
        🌟 Alumni Quest: Find Your Mentors! 🌟
      </Typography>

      <Typography
        variant="h6"
        align="center"
        sx={{
          color: '#01579b',
          fontSize: '1.2rem',
          mb: 5,
          fontWeight: 'bold',
        }}
      >
        🎓 Start your quest by entering your university name to connect with alumni!
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
                height: '56px',
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#b3e5fc',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.mode === 'dark' ? '#90caf9' : '#1e88e5',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'dark' ? '#90caf9' : '#1e88e5',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.mode === 'dark' ? '#42a5f5' : '#1565c0',
              },
              color: theme.palette.text.primary,
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
              height: '56px',
              fontSize: '1.2rem',
              backgroundColor: '#00bcd4',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00838f',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
          >
            {loading ? 'Searching...' : 'Start the Quest!'}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3, mb: 3, fontWeight: 'bold', backgroundColor: '#ffebee' }}>
          {error}
        </Alert>
      )}

      {/* Display success message in a Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message={successMessage}
        sx={{ backgroundColor: '#388e3c', color: '#fff' }}
      />

      {/* Show Alumni Data with Fun Animations */}
      {alumniData.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 5,
            borderRadius: 3,
            p: 3,
            backgroundColor: '#e1f5fe',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="h5" align="center" sx={{ color: '#0288d1', fontWeight: 'bold', mb: 3 }}>
            🏆 Alumni Found! Here are some amazing alumni to connect with:
          </Typography>
          <Table sx={{ minWidth: 650 }} aria-label="alumni table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>University</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.4rem' }}>LinkedIn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumniData.map((alumni, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(even)': { backgroundColor: '#f1f8e9' },
                    '&:nth-of-type(odd)': { backgroundColor: '#ffffff' },
                    '&:hover': { backgroundColor: '#e0f7fa' },
                  }}
                >
                  <TableCell sx={{ fontSize: '1.2rem' }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem' }}>{alumni.name}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem' }}>{alumni.university_name}</TableCell>
                  <TableCell sx={{ fontSize: '1.2rem' }}>
                    <Link href={alumni.linkedin_link} target="_blank" rel="noopener noreferrer">
                      Connect on LinkedIn
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
