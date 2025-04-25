import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaShoppingCart, FaListAlt, FaLightbulb, FaClipboardList, FaPenFancy } from "react-icons/fa";
import UserNavbar from "./UserNavbar";

const navItems = [
  {
    label: "Grocery List",
    icon: <FaShoppingCart />, 
    route: "/grocery-list",
    description: "Easily add, update, or delete items in your pantry with one click."
  },
  {
    label: "Shopping List",
    icon: <FaListAlt />, 
    route: "/shopping-list",
    description: "Plan your market trips without missing a thing!"
  },
  {
    label: "Suggest Recipe",
    icon: <FaLightbulb />, 
    route: "/suggest-recipes",
    description: "Let us suggest dishes based on what’s in your kitchen."
  },
  {
    label: "All Recipes",
    icon: <FaClipboardList />, 
    route: "/recipes",
    description: "Explore recipes contributed by our vibrant community."
  },
  {
    label: "My Recipes",
    icon: <FaPenFancy />, 
    route: "/my-recipes",
    description: "View, edit, or delete your submitted recipes."
  },
];

export default function UserHomePage() {
  const navigate = useNavigate(); 

  return (
    <Box maxWidth="false"
    className='gradient-bg'
    style={{
      margin: '-8px',
      color: '#fff',
    }}>
      {/* Navbar */}
      <UserNavbar />

      {/* Welcome Section */}
      <Box sx={{ position: "relative", height: "160px", overflow: "hidden", marginTop: '15px' }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography className="bouncing-txt" variant="h3" sx={{ textShadow: "4px 4px #00000030", fontFamily: "'Luckiest Guy', static", }}>
            🍽️ Welcome to Your Funky Kitchen Assistant!
          </Typography>
          <Typography variant="h6" sx={{ mt: 2, textShadow: "3px 3px #00000030" }}>
            Let’s spice up your meals with a smart assistant built for flavor and fun!
          </Typography>
        </Box>
      </Box>

      {/* Scrolling Cards Section */}
      <Container maxWidth="md" sx={{ py: 4 }}>
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ marginBottom: "2rem" }}
          >
            <Paper
              elevation={6}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
                alignItems: "center",
                p: 4,
                borderRadius: 4,
                backgroundColor: "#fff",
                color: "#333",
                gap: 3,
                height: '120px', 
                cursor:'pointer',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              }}
              onClick={() => navigate(item.route)}
            >
              <Box sx={{ fontSize: 50, color: "#ff4081" }}>{item.icon}</Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {item.label}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 16 }}>
                  {item.description}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Container>
    </Box>
  );
}