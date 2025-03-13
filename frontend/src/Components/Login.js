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
    maxWidth="false"
    className='gradient-bg'
    style={{
      margin: '-8px',
    }}
    >
      <Container
      maxWidth ="xs"
      style={{
        padding: '30px',
        borderRadius: '25px',
        minHeight: '500px',
      }}
      >
      <ToastContainer />
      {isRegistering ? (
        <Register toggleRegister={toggleRegister} />
      ) : (
        <>
          <Typography
            variant="h4"
            className="bouncing-txt"
            style={{ color: '#fff', paddingTop: '100px', fontFamily: "'Luckiest Guy', static", width: '100%', fontSize: '3rem', }}
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
              className="button add-item"
            >
              Login
            </Button>
            <Typography
              variant="body2"
              style={{ textAlign: 'center', marginTop: '10px', cursor: 'pointer', color: '#fff', fontSize: '1rem',fontWeight: 'bold', textShadow: '5px 5px 13px #666666', }}
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
