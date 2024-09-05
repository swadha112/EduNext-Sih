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

const Counselors = () => {
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
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        Find Career Counselors
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Enter your address"
            value={address}
            onChange={handleInputChange}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                height: '56px', // Ensuring the input height matches the button height
              },
            }}
          />
        </Grid>
        <Grid item xs={15} sm={4} md={3}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || !address}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              height: '56px', // Matching the button height with the input field
              fontSize: '1rem', // Ensuring font size is clear and readable
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
        <TableContainer component={Paper} sx={{ mt: 5, maxHeight: '70vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Website</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>Google Maps</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {counselors.map((counselor, index) => (
                <TableRow key={index}>
                  <TableCell>{counselor.title}</TableCell>
                  <TableCell>
                    <a href={counselor.url} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={counselor.maps_link} target="_blank" rel="noopener noreferrer">
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
