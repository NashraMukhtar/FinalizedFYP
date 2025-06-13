import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, IconButton, Dialog, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { AccountCircle } from "@mui/icons-material";
import "../App.css";
import Logout from "./Logout";

export default function UserNavbar() {

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
            padding: "10px",
            position: "sticky", 
            top: 0, 
            zIndex: 1000, 
            }}>
      {/* PROFILE DROPDOWN */}
      <div style={{
            gap: "18px",
            display:"flex"
            }}>
        <IconButton onClick={handleClick} size="large"
        sx={{
          color: "black", 
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
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

        <Link to="/home"style={{textDecoration:"none", paddingTop:"8px"}}>
            <Button className={"button nav-btn"} style={{border:"1px solid white",}}>
            Home
            </Button>
        </Link>
        <Typography variant="h4" style={{color:"white", paddingTop:"20px", fontSize:"21px", paddingLeft:"50px", textShadow: "6px 6px 4px rgb(91, 87, 87)", fontFamily: "'Luckiest Guy', static",}}>
          Grocery Management with Recipe Suggestion
        </Typography>
      </div>
      
      {/* NAVIGATION BUTTONS */}
      <div style={{
            paddingTop:"10px", 
            gap: "18px",
            display:"flex",
            }}>

        {/* <Link to="/grocery-list" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                Grocery List
            </Button>
        </Link> */}
        <Link to="/shopping-list" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                Shopping List
            </Button>
        </Link>
        <Link to="/all-recipes" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                All Recipes
            </Button>
        </Link>
        <div style={{ marginTop: "-5px", marginRight: "-30px"}}>
          {/* <Link to="/home" style={{border: "1px solid black", backgroundColor:"black", padding: "2px"}}> */}
            <img 
              src="/Logo.png" 
              alt="Logo" 
              style={{ height: "55px", cursor: "pointer", border: "2px solid white",borderRadius:"50%" }}
            />
          {/* </Link> */}
        </div>
      </div>
      
    </nav>
  );
}
