import { useState, useEffect } from "react";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI  from "../APIs/ingredientAPI"
import { Box, Typography, Container, Grid, Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import UserNavbar from './UserNavbar';

const SuggestRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
        const token = localStorage.getItem("token");
        recipeAPI.getSuggestedRecipes(token).then((data) => {
        setRecipes(data);
    });

        ingredientAPI.getIngredients(token).then((data) => {
            if (Array.isArray(data)) {
                setIngredients(data);
            } else {
              console.error("Unexpected ingredient data format", data);
            }
          })
          .catch((error) => console.error("Error fetching ingredients:", error));
      }, []);

      const handleOpen = (recipe) => {
        setSelectedRecipe(recipe);
        setOpen(true);
      };
      
      const handleClose = () => {
        setOpen(false);
        setSelectedRecipe(null);
      };

  return (
    <Container
      maxWidth="false"
      className='gradient-bg'
      style={{
        margin: '-8px',
      }}
    >
        <UserNavbar />
    
      <Box>  
        <Typography
          variant="h2"
          className="bouncing-txt"
          sx={{
            color: "#ffffff",
            marginTop: "2%",
            width: "100%",
            fontFamily: "'Luckiest Guy', static",
          }}
          >
          Suggested Recipes
        </Typography>
        {/* <Typography
          variant="h6"
          sx={{
            width: "100%",
            color: "#fff",
            fontFamily: "'Luckiest Guy', static",
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 300,
            textShadow: '3px 3px 6px rgb(91, 87, 87)',
          }}
        >
          Smart picks based on what’s in your kitchen!
        </Typography> */}

        {/* Quick Stats Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 4,
            marginTop: 2,
            flexWrap: 'wrap',
            color: "#fff",
            fontFamily: "'Luckiest Guy', static",
            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
          }}
        >
          <Typography variant="h6">
            📋 Total Recipes Suggested: {recipes.length}
          </Typography>

          <Typography variant="h6">
            ✅ Ready-To-Make: {recipes.filter(r => r.unmatched_ingredients.length === 0).length}
          </Typography>

        </Box>

          {/*CARDS SECTION*/}
        <Grid container spacing={2} sx={{ marginTop: 2, width: '80%', marginLeft:'10%'}}>
          {recipes
            .sort((a, b) => a.unmatched_ingredients.length - b.unmatched_ingredients.length)
            .map((recipe) => {

              return (
                <Grid item xs={12} sm={6} md={4} key={recipe.id} onClick={() => handleOpen(recipe)}>
                  <Card
                    className="cards"
                    sx={{
                      borderRadius: 3,
                      border: "1px solid #b3b3b3",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      '&:hover': {
                        backgroundColor: "#f5f5f5",
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h5" fontWeight="bold">
                        {recipe.name}
                      </Typography>
                      <Typography variant="body2" color="error.main">
                        {recipe.unmatched_ingredients.length} unmatched ingredient{recipe.unmatched_ingredients.length !== 1 ? 's' : ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{borderRadius: '30px'}}>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #EC6885, #8167C4)', 
          color: '#fff', 
          textAlign: 'center',
          fontSize: '2.3rem',
          letterSpacing: '1px',
          padding: '16px',
          fontFamily: "'Luckiest Guy', static",
        }}>
            {selectedRecipe?.name}
        </DialogTitle>
      
        <DialogContent sx={{ padding: '20px', backgroundColor: '#f5f5f5', paddingLeft: '50px', height: '300px', overflowY: 'auto', }}>
            {/* Category */}
            <Typography variant="h6" mt={5} sx={{ marginBottom: '10px', color: '#333' }}>
            <strong>Description:<br></br></strong> {selectedRecipe?.description}
            </Typography>
      
            {/* Ingredients */}
            <Typography variant="h6" mt={2} sx={{color: '#333'}}><strong>Ingredients:</strong></Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {selectedRecipe?.recipe_ingredients.map((item, index) => {
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
      
            {/* Steps */}
            <Typography variant="h6" mt={2} sx={{ marginBottom: '10px', color: '#333' }}>
            <strong>Steps:<br></br></strong> {selectedRecipe?.steps}
            </Typography>

            {/* UNMATCHED INGREDIENTS */}
            <Typography variant="h6" mt={3} sx={{ color: 'error.main' }}>
              <strong>Missing Ingredients:</strong>
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedRecipe?.unmatched_ingredients.length === 0 ? (
          <Typography
            component="span"
            sx={{
              color: "success.main",
              fontWeight: "bold",
              fontStyle: "italic",
              backgroundColor: "#e8f5e9",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          >
            You’ve got everything! 🧑‍🍳✨
          </Typography>
        ) : (
            selectedRecipe?.unmatched_ingredients.map((item, index) => {
              const ingredientName = item.name;
              const missingIng = Array.isArray(ingredients)
              ? ingredients.find(
                  (ing) =>
                    ing.name.toLowerCase() === ingredientName.toLowerCase()
                )
              : null;
              return (
                <Typography
                  key={index}
                  component="span"
                  sx={{
                    marginRight: 2,
                    color: "error.main",
                    fontWeight: "bold",
                    border: "1px dashed #e57373",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    backgroundColor: "#ffebee",
                  }}
                >
                  {missingIng ? missingIng.name : ingredientName}
                  </Typography>
                );
              })
            )}
          </Box>

        </DialogContent>
      
        <DialogActions sx={{ justifyContent: 'center', padding: '16px'}}>
          <Button 
          onClick={handleClose} 
          className={"button add-item"} style={{border:"1px solid white",}}
          >
          Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuggestRecipes;
