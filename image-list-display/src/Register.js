import React, { useState } from 'react';
import { Container, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/register/', { username, password });
      setMessage(`Registration successful! Token: ${response.data.token}`);
    } catch (error) {
      setMessage('Error during registration.');
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
      <Button variant="contained" color="primary" onClick={handleRegister}>
        Register
      </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={message.includes('successful') ? 'success' : 'error'}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
