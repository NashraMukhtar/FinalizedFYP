import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Register from './Register';
import AuthContext from '../Context/AuthContext'; // Import AuthContext

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useContext(AuthContext); // Access the login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password); // Call the login function from context
      toast.success('Login successful!', {
        position: 'top-right',
      });
      const role = localStorage.getItem('role');
      if (role === '"admin"') {
        navigate('/admin-panel'); // Redirect admin to Ingredients page
      }else{
        navigate('/home'); // Redirect user to Home page
      }
    } catch (err) {
      toast.error('Invalid credentials or an error occurred!', {
        position: 'top-right',
      });
    }
  };

  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
  };

  return (
    <Container
    maxWidth={false}
    className='gradient-bg'
    style={{
      margin: '-8px',
      padding: 0,
    }}
    >
      <Container
      maxWidth ="xs"
      style={{
        padding: '20px',
        borderRadius: '25px',
        minHeight: '500px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(5px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
      >
      <ToastContainer />
      {isRegistering ? (
        <Register toggleRegister={toggleRegister} />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h4"
              className="bouncing-txt"
              sx={{
              color: '#fff',
              fontFamily: "'Luckiest Guy', cursive",
              textAlign: 'center',
              fontSize: {
                xs: '2.2rem',
                sm: '2.8rem',
                md: '3rem',
              },
              paddingTop: {
                xs: '60px',
                sm: '80px',
                md: '100px',
              },
            }}
            >
              Login
            </Typography>
          </Box>
          <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
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
              Login
            </Button>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                marginTop: '10px',
                cursor: 'pointer',
                color: '#fff',
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                },
                fontWeight: 'bold',
                textShadow: '5px 5px 13px #666666',
              }}
              onClick={toggleRegister}
            >
              Don't have an account? Register Here
            </Typography>
          </form>
        </>
      )}
      </Container>
    </Container>
  );
};

export default Login;
