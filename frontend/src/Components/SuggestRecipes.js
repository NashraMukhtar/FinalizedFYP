import { useState, useEffect } from "react";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI  from "../APIs/ingredientAPI"
import { Box, Typography, List, ListItem, ListItemText, Paper, Container } from "@mui/material";
import UserNavbar from './UserNavbar';


const SuggestRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);


  useEffect(() => {
        const token = localStorage.getItem("token");
        recipeAPI.getSuggestedRecipes(token).then((data) => {
        setRecipes(data);
        setSelectedRecipe(data.length > 0 ? data[0] : null);
    });

        ingredientAPI.getIngredients(token).then((data) => {
            if (Array.isArray(data)) {
                setIngredients(data);
                console.log("Ingredients List:", data);
            } else {
              console.error("Unexpected ingredient data format", data);
            }
          })
          .catch((error) => console.error("Error fetching ingredients:", error));
      }, []);

  return (
    <Container
    maxWidth="false"
      className='gradient-bg'
      style={{
        margin: '-8px',
      }}
    >
        <UserNavbar />
    
    <Box display="flex" height="70vh" justifyContent="space-between">
      {/* Left Panel - Recipe List */}
      <Paper sx={{ width: "27%", height: "73vh", overflowY: "auto", padding: 2, borderRadius: "20px", boxShadow: '4px 4px 10px #808080',}}>
        <Typography variant="h5" className= "bouncing-txt" 
          sx={{fontFamily: "'Luckiest Guy', static", padding: "20px 70px", borderRadius: "25px",}}>
          Suggested Recipes
        </Typography>
        <List>
          {recipes.sort((a, b) => a.unmatched_ingredients.length - b.unmatched_ingredients.length).map((recipe) => (
            <ListItem
              key={recipe.id}
              selected={selectedRecipe?.id === recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              sx={{
                borderRadius: 1,
                border: "1px solid #b3b3b3",
                backgroundColor: selectedRecipe?.id === recipe.id ? "#d1e7dd" : "transparent",
                '&:hover': { backgroundColor: "#e0e0e0" },
                cursor: "pointer",
              }}
            >
              <ListItemText
                primary={recipe.name}
                secondary={`${recipe.unmatched_ingredients.length} unmatched ingredients`}
                primaryTypographyProps={{ fontWeight: "bold" }}
                secondaryTypographyProps={{ color: "error.main" }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Panel - Recipe Details */}
      <Box sx={{ width: "65%", padding: 3, overflowY: "auto", height: "70vh", background:"linear-gradient(135deg, #e1dbf0, #fff,  #e1dbf0)", borderRadius: "20px", border: "2px dashed #808080",}}>
        {selectedRecipe && (
          <>
            <Typography variant="h4" fontWeight="500"
              sx={{
                fontFamily: "'Luckiest Guy', static",
                width: "100%",
                textAlign: "center",
              }}>
              Title: {selectedRecipe.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" my={2} sx={{
                width: "100%",
                textAlign: "center",
              }}>
              {selectedRecipe.description}
            </Typography>
            <Typography variant="h6" fontWeight="bold" mt={3}>Ingredients</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {selectedRecipe.recipe_ingredients.map((item, index) => {
                const ingredientObj = Array.isArray(ingredients)
                  ? ingredients.find((ing) => ing.id === item.ingredient)
                  : null;
                   
                return (
                  <Typography key={index} component="span" sx={{ marginRight: 3 }}>
                    • {ingredientObj ? ingredientObj.name : "Unknown Ingredient"}
                  </Typography>
                );
              })}
            </Box>
            <Typography variant="h6" fontWeight="bold" mt={3}>Steps</Typography>
            <Typography variant="body1">{selectedRecipe.steps}</Typography>
            <Typography variant="h6" fontWeight="bold" color="error.main" mt={3}>Unmatched Ingredients</Typography>
            {selectedRecipe.unmatched_ingredients.length > 0 ? (
              <List>
                {selectedRecipe.unmatched_ingredients.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={item.name} primaryTypographyProps={{ color: "error.main" }} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" mt={1} color="error.main">
                None
              </Typography>
            )}
          </>
        )}
      </Box>
    </Box>
    </Container>
  );
};

export default SuggestRecipes;
