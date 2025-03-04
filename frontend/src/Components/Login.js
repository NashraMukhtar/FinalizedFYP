import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
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
      console.log(role);
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
      maxWidth="xs"
      style={{
        backgroundColor: '#A7DFC1', // Bright and funky color scheme
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '50px',
      }}
    >
      <ToastContainer />
      {isRegistering ? (
        <Register toggleRegister={toggleRegister} />
      ) : (
        <>
          <Typography
            variant="h4"
            style={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}
          >
            Login
          </Typography>
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
              variant="contained"
              style={{
                backgroundColor: '#088484', // Funky green color
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '20px',
              }}
            >
              Login
            </Button>
            <Typography
              variant="body2"
              style={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer' }}
              onClick={toggleRegister}
            >
              Don't have an account? Register Here
            </Typography>
          </form>
        </>
      )}
    </Container>
  );
};

export default Login;
