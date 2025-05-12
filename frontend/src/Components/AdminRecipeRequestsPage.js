import React, { useEffect, useState } from "react";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI from "../APIs/ingredientAPI";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminRecipeRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [ingredientMap, setIngredientMap] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchAllIngredients();
  }, []);
  
  
  const fetchAllIngredients = async () => {
    const token = localStorage.getItem('token');
    const res = await ingredientAPI.getIngredients(token);  // your api call
    const map = {};
    res.forEach(ingredient => {
      map[ingredient.id] = ingredient.name;
    });
    setIngredientMap(map);
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await recipeAPI.getRecipeRequests(token);
      setRequests(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch recipe requests.");
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await recipeAPI.approveRecipe(id, token);
      toast.success("Recipe Approved and Added to All Recipes!");
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve recipe.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await recipeAPI.rejectRecipe(id, token);
      toast.success("Recipe Rejected!");
      fetchRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject recipe.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#1E1E1E", minHeight: "100vh", p: 4,m: "-8px"}}>
      <ToastContainer autoClose={2000} />

      <Typography
        variant="h3"
        sx={{
          color: "#FFA500",
          fontWeight: "bold",
          textAlign: "center",
          mb: 4,
        }}
      >
        Pending Recipe Requests
      </Typography>

      {requests.length === 0 ? (
        <Typography variant="h6" sx={{ color: "white", textAlign: "center" }}>
          No pending requests.
        </Typography>
      ) : (
        requests.map((request) => (
          <Card
            key={request.id}
            sx={{
              backgroundColor: "#2C2C2C",
              color: "white",
              mb: 3,
              boxShadow: "0 4px 8px rgba(255, 165, 0, 0.3)",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ color: "#FFA500", fontWeight: "bold", mb: 1 }}>
                {request.title}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                {request.description}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Steps:</strong> {request.instructions}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Ingredients:</strong> {request.ingredients.map(id => ingredientMap[id] || "Unknown").join(", ")}
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Submitted At:</strong> {new Date(request.submitted_at).toLocaleString()}
              </Typography>

              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Submitted By: {request.user}</strong>
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => handleApprove(request.id)}
                  sx={{
                    backgroundColor: "#FFA500",
                    color: "#1E1E1E",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#cc8400",
                    },
                  }}
                >
                  Approve
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleReject(request.id)}
                  sx={{
                    borderColor: "#FFA500",
                    color: "#FFA500",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FFA500",
                      color: "#1E1E1E",
                    },
                  }}
                >
                  Reject
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default AdminRecipeRequestsPage;
