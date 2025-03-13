import React, { useContext } from 'react';
import { Button, Container, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CloseIcon from "@mui/icons-material/Close";
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '../Context/AuthContext';

const Logout = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Access logout function from AuthContext

  const handleLogout = () => {
    // Clear local storage and perform cleanup
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Call logout function from context (if implemented)
    if (logout) logout();

    // Show logout success message
    toast.success('Logged out successfully!', {
      position: 'top-right',
    });

    // Redirect to login page
    navigate('/login');
  };

  return (
    <Container
      maxWidth="md"
      style={{
        background: 'radial-gradient(circle, #ebda93, #ff9980)',
        padding: '30px 60px',
        textAlign: 'center',
      }}
    >
      <ToastContainer />
      <IconButton
        onClick={onClose}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#333",
        }}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h4" style={{ fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
        Logout
      </Typography>
      <Typography variant="body1" style={{ color: '#555', marginBottom: '20px' }}>
        Are you sure you want to log out?
      </Typography>
      <Button
        onClick={handleLogout}
        fullWidth
        variant="contained"
        style={{
          backgroundColor: '#E63946', // Bright red for logout button
          color: '#fff',
          fontWeight: 'bold',
          textTransform: 'none',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          borderRadius: '20px',
        }}
      >
        Logout
      </Button>
    </Container>
  );
};

export default Logout;
