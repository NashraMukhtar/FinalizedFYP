import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, MenuItem, IconButton, Dialog } from "@mui/material";
import { motion } from "framer-motion";
import { AccountCircle } from "@mui/icons-material";
import {Button} from "@mui/material";
import "../App.css";
import Logout from "./Logout";

export default function Navbar() {

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
            display:"flex",
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

        <Link to="/suggest-recipes"style={{textDecoration:"none", paddingTop:"8px"}}>
            <Button className={"button nav-btn"} style={{border:"1px solid white",}}>
            Suggest Recipe
            </Button>
        </Link>
      </div>
      
      {/* NAVIGATION BUTTONS */}
      <div style={{
            paddingTop:"10px", 
            gap: "18px",
            display:"flex",
            }}>

        <Link to="/home" style={{textDecoration:"none",}}>
            <Button className={"button nav-btn"} sx={{border:"1px solid white",}}>
                Grocery List
            </Button>
        </Link>
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
      </div>
    </nav>
  );
}
