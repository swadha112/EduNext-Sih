import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";

const Workshops = () => {
  const theme = useTheme();
  const [domain, setDomain] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5050/api/workshop/search", {
        domain,
        city,
      });
      if (response.data.success) {
        setResults(response.data.data);
        setError("");
      } else {
        setError("No results found");
      }
    } catch (err) {
      setError("Error fetching search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        align="left"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#4A4A4A",
          ml: 1,
          fontSize: "2.5rem",
        }}
      >
        Search for Career Workshops
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Career Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd',
                borderRadius: '8px',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#e3f2fd',
                borderRadius: '8px',
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !domain || !city}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              height: "56px",
              backgroundColor: theme.palette.mode === 'dark' ? '#f7819f' : '#3f51b5',
              color: '#fff',
              "&:hover": {
                backgroundColor: theme.palette.mode === 'dark' ? '#303f9f' : '#303f9f',
              },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Web Results
          </Typography>
          <Grid container spacing={3}>
            {results.siteLinks.map((result, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {result.snippet}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.url}
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Google Maps Results
          </Typography>
          <Grid container spacing={3}>
            {results.mapLinks.map((place, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {place.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link
                      href={`https://www.google.com/maps?q=${place.google_maps_link.latitude},${place.google_maps_link.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps
                    </Link>
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

export default Workshops;
