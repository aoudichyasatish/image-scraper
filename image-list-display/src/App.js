import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import Register from './Register';
import Login from './Login';

const App = () => {
  const [urls, setUrls] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleInputChange = (e) => {
    setUrls(e.target.value);
    setError('');
  };

  const validateUrls = async (urlString) => {
    const urlArray = urlString.split(',');
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$', 'i'
    );
    return urlArray.every(url => urlPattern.test(url.trim()));
  };
    
  const handleSubmit = async () => {
    if (!await validateUrls(urls)) {
      setError('Please enter valid URLs.');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setImages([]);
    setPage(1);
    setHasMore(false);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/scrape-images/',
        { urls },
        { headers: { Authorization: `Token ${token}` }, params: { page: 1 } }
      );
      setImages(response.data.results);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const loadMoreImages = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/scrape-images/',
        { urls },
        { headers: { Authorization: `Token ${token}` }, params: { page: page + 1 } }
      );
      setImages((prevImages) => [...prevImages, ...response.data.results]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(response.data.next !== null);
    } catch (error) {
      console.error('Error loading more images:', error);
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!token) {
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Image Scraper
        </Typography>
        <Register />
        <Login setToken={setToken} />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Image Scraper
      </Typography>
      <TextField
        label="Enter URLs"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={urls}
        onChange={handleInputChange}
        error={!!error}
        helperText={error}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
        Submit
      </Button>
      {loading && <CircularProgress style={{ marginTop: '20px' }} />}
      <Grid container spacing={2} style={{ marginTop: '20px' }}>
        {images.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <img src={image} alt={`Scraped ${index}`} style={{ width: '100%', borderRadius: '8px' }} />
          </Grid>
        ))}
      </Grid>
      {hasMore && !loading && (
        <Button variant="contained" color="secondary" onClick={loadMoreImages} style={{ marginTop: '20px' }}>
          Load More
        </Button>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error">
          {error || 'An error occurred. Please try again.'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
