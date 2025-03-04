import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
// import "./Navbar.css"; // Optional: Add custom CSS for styling

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#ff6f61", color: "#fff", width: "100%" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontFamily: "'Poppins', sans-serif" }}
        >
          Grocery Manager
        </Typography>
        <Button
          color="inherit"
          onClick={() => navigate("/shopping-list")}
          sx={{
            fontFamily: "'Poppins', sans-serif",
            "&:hover": { backgroundColor: "#ff8a80", color: "#fff" },
          }}
        >
          Shopping List
        </Button>
        <Button
          color="inherit"
          onClick={() => navigate("/recipes")}
          sx={{
            fontFamily: "'Poppins', sans-serif",
            "&:hover": { backgroundColor: "#ff8a80", color: "#fff" },
          }}
        >
          Suggest Recipes
        </Button>
        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            fontFamily: "'Poppins', sans-serif",
            backgroundColor: "#d32f2f",
            "&:hover": { backgroundColor: "#ff6659" },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
