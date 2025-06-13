import { Link } from 'react-router-dom';
import { Menu, MenuItem, IconButton, Button, Dialog, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { AccountCircle } from "@mui/icons-material";
import { useState } from 'react';
import '../App.css';
import Logout from './Logout'

export default function AdminNavbar () {
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const open = Boolean(anchorEl);
  
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = () => {
        setAnchorEl(null);
      };
    
      const handleLogout = () => {
        setOpenDialog(true);
        handleClose();
      };
    
      const handleDialogClose = () => {
        setOpenDialog(false);
      };

  return (
    <nav style={{ 
        display: "flex",
        justifyContent:"space-between",
        padding: "5px",
        position: "sticky", 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: "#4682B4",
        }}>
        
        {/* NAV-BTNS SIDE */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        width:"65%",
        paddingTop:"6px",
        paddingLeft: "20px",
        }}>
        <img 
          src="/Logo.png" 
          alt="Logo" 
          style={{ height: "50px", cursor: "pointer", border: "2px solid white", borderRadius:"50%" }}
        />
        <Typography variant="h4" style={{color:"white", fontSize:"21px", paddingTop:"13px", textShadow: "6px 6px 4px rgb(91, 87, 87)", fontFamily: "'Luckiest Guy', static",}}>
          Grocery Management with Recipe Suggestion
        </Typography>
      </div>

        {/* DROPDOWN SIDE */}
      <div style={{
        display: "flex",
        gap: "16px",
        paddingRight: "10px",
      }}>
        <Link to="/admin/requests">
          <Button className="admin-nav-btn" sx={{fontWeight:'bold', color: 'black', backgroundColor: '#D3D3D3', marginTop: '10px'}}>Requests</Button>
        </Link>

        <IconButton onClick={handleClick} size="large"
        sx={{
          color: "white", 
          backgroundColor: "f0f0f0",
        }}>
          <AccountCircle fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: motion.div,
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
            transition: { duration: 0.2 },
            sx: {
              backgroundColor: "#f2f2f2",
              color: "black",
              boxShadow: 3,
            },
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <Logout onClose={handleDialogClose} />
        </Dialog>
      </div>
    </nav>
  );
};
