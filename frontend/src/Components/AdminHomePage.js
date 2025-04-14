import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLandingPage = () => {
  const navigate = useNavigate();

  // Modern Industrial Color Palette
  const colors = {
    background: "#292F36",
    card: "#1E1E1E",
    text: "#D3D3D3",
    accent: "#4682B4",
    highlight: "#FFBF00",
  };

  const handleNavigation = (path) => navigate(path);

  const sections = [
    { title: "Manage Users", path: "/admin/users" },
    { title: "Manage Recipes", path: "/admin/recipes" },
    { title: "System Logs", path: "/admin/logs" },
  ];

  return (
    <div style={{margin: '-8px',
      height: "100vh"
    }}>
      <AdminNavbar />
      <div style={{
      background: colors.background,
      color: colors.text,
      height: "80vh",
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
        <Grid container spacing={3} justifyContent="center" maxWidth="800px">
          {sections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleNavigation(section.path)}
                sx={{
                  background: colors.card,
                  color: colors.text,
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  '&:hover': {
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 20px ${colors.highlight}`,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h5" align="center" gutterBottom>
                    {section.title}
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      backgroundColor: colors.accent,
                      '&:hover': { backgroundColor: colors.highlight },
                    }}
                  >
                    Go
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default AdminLandingPage;

