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
        setError("No results found.");
      }
    } catch (err) {
      setError("Error fetching search results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        px: 3,
        background: "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)", // Soft pastel gradient
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#5c6bc0",
          fontFamily: "'Comic Sans MS', cursive, sans-serif",
        }}
      >
        Find Career Workshops 
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Career Domain"
            placeholder="E.g., Coding, Art"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "8px",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="City"
            placeholder="E.g., New York"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "8px",
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
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
            sx={{
              height: "50px",
              backgroundColor: "#64b5f6",
              fontWeight: "bold",
              borderRadius: "8px",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#42a5f5",
              },
            }}
          >
            {loading ? "Searching..." : "Search"}
          </Button>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 3, borderRadius: "8px" }}>
          {error}
        </Alert>
      )}

      {results && (
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: "#43a047", fontWeight: "bold" }}
          >
            Results
          </Typography>
          <Grid container spacing={2}>
            {results.siteLinks.map((result, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#e3f2fd",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      {result.snippet}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link href={result.url} target="_blank" rel="noopener noreferrer" underline="hover">
                      Learn More
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2}>
            {results.mapLinks.map((place, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#e3f2fd",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {place.name}
                    </Typography>
                  </CardContent>
                  <CardActions>
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