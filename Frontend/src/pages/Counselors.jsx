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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Counselors = () => {
  const theme = useTheme(); // Access the current theme (light or dark)
  const [address, setAddress] = useState('');
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setAddress(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
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
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#4A4A4A',
        }}
      >
        Find Career Counselors
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
            disabled={loading || !address}
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

      {counselors.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            mt: 5,
            maxHeight: '70vh',
            backgroundColor: theme.palette.background.paper, // Adapt table background to theme
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  Title
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  Website
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    color: theme.palette.text.primary,
                  }}
                >
                  Google Maps
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counselors.map((counselor, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    {counselor.title}
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    <a
                      href={counselor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.palette.primary.main }}
                    >
                      Visit Website
                    </a>
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    <a
                      href={counselor.maps_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: theme.palette.primary.main }}
                    >
                      View on Google Maps
                    </a>
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

export default Counselors;
