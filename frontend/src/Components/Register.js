import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authAPI from '../APIs/authAPI';  // Adjust the import as needed

const Register = ({ toggleRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const data = await authAPI.register(username, email, password);  // Make sure to create this API in authAPI.js
      if (data) {
        toast.success('Registration successful! Please log in.', {
            position: 'top-right',
        });
        toggleRegister();  // Switch back to login form
      }
    } catch (err) {
      toast.error('An error occurred during registration!', {
        position: 'top-right',
      });
    }
  };

  return (
    <Container
      maxWidth="xs"
      style={{
        backgroundColor: '#ffdf00',  // Match the Login component's style
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
      }}
    >
      <ToastContainer />
      <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ marginTop: '20px' }}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          style={{
            backgroundColor: '#00C853',  // Funky green color
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'none',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;
