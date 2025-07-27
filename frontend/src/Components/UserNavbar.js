import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, MenuItem, IconButton, Dialog, Button, Typography, Box } from "@mui/material";
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
    <Box sx={{ 
            display: "flex",
            justifyContent:"space-between",
            padding: "10px",
            position: "sticky", 
            top: 0, 
            zIndex: 1000, 
            width: {xs:"90%",md:"100%"},
            overflowX: 'hidden',
            }}>
      {/* LEFT SIDE OF NAVBAR, PROFILE DROPDOWN + TITLE */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginLeft:{xs:"-15px", md:"0px"} }}>
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
        <Typography variant="h4" sx={{color:"white", paddingTop:"20px", fontSize:{xs:"15px",md:"21px"}, paddingLeft:{xs:"7px",md:"30px"}, textShadow: "6px 6px 4px rgb(91, 87, 87)", fontFamily: "'Luckiest Guy', static",}}>
          Grocery Management with Recipe Suggestion
        </Typography>
      </Box>
      
      {/* RIGHT SIDE OF NAVBAR, NAVIGATION BUTTONS + LOGO */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection:{xs:"column", sm:"row",md:"row"}, marginLeft:{xs:"10px",md:"-20px"}, paddingTop:{xs:"20px",md:"0px"}}}>
          <Link to="/shopping-list" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                Shopping
            </Button>
        </Link>
        <Link to="/all-recipes" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                Recipes
            </Button>
        </Link>
        </Box>
        <Box style={{ marginTop: "-5px", marginRight: "-30px"}}>
            <img 
              src="/Logo.png" 
              alt="Logo" 
              style={{ height: "55px", cursor: "pointer", border: "2px solid white",borderRadius:"50%" }}
            />
        </Box>
      </Box>
      
    </Box>
  );
}
