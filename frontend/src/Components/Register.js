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
      const data = await authAPI.register(username, email, password);
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
    maxWidth ="xs"
    sx={{
            // margin: '-8px',
            width: '100%', overflowX: 'hidden'
        }}
    >
      <ToastContainer />
      <Typography 
            variant="h4"
            className="bouncing-txt"
            style={{ color: '#fff', paddingTop: '40px', fontFamily: "'Luckiest Guy', static", width: '100%', fontSize: '3rem', }}>
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
          className="button add-item"
        >
          Register
        </Button>
        <Typography
              variant="body2"
              style={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#fff', fontSize: '1rem',fontWeight: 'bold', textShadow: '5px 5px 13px #666666', }}
              onClick={toggleRegister}
            >
              Already have an account? Login Here
            </Typography>
      </form>
    </Container>
  );
};

export default Register;
