import React from "react";
import { Grid, Card, CardContent, Typography, Button, Paper  } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from 'recharts';
import { useEffect, useState } from 'react';
import authAPI from '../APIs/authAPI';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

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
    { title: "Manage Ingredients", path: "/admin/ingredients" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    authAPI.getDashboardCounts(token)
      .then(res => {
        const counts = res;
        setData([
          { name: 'Recipes', count: counts.recipes },
          { name: 'Users', count: counts.users },
          { name: 'Ingredients', count: counts.ingredients },
        ]);
      })
      .catch(err => {
        toast.error('Failed to load dashboard data');
      });
  }, []);


  return (
    <div style={{margin: '-8px',
      height: "100vh"
    }}>
      <AdminNavbar />
      {/* BAR CHART */}
      <div style={{
      background: colors.background,
      color: colors.text,
      height: "82vh",
      paddingTop: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}>
        <Grid container spacing={3} justifyContent="center" maxWidth="900px">
          {sections.map((section, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                onClick={() => handleNavigation(section.path)}
                sx={{
                  background: colors.card,
                  color: colors.text,
                  cursor: "pointer",
                  height: "120px",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  '&:hover': {
                    transform: "scale(1.05)",
                    boxShadow: `0 4px 20px ${colors.highlight}`,
                  },
                }}
              >
                <CardContent>
                  <Typography align="center" gutterBottom>
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
        <br></br>
        <Paper elevation={3} style={{ width: '70%', padding: 16, backgroundColor: '#373f49' }}>
        <Typography variant="h5" gutterBottom color="white">
          📊 Dashboard Overview
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip 
            contentStyle={{
              backgroundColor: '#2c2c2c',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#aaa' }}
            itemStyle={{ color: '#fff' }} />
            <Bar dataKey="count" fill="#4682B4" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      </div>
    </div>
  );
};

export default AdminLandingPage;

