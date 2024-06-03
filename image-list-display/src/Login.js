import React, { useState } from 'react';
import { Container, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', { username, password });
      setToken(response.data.token);
      setMessage('Login successful!');
    } catch (error) {
      setMessage('Error during login.');
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <TextField
        label="Username"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={message.includes('successful') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
