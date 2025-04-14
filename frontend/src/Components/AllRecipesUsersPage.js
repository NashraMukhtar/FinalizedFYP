import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Box, Typography, Grid, Card, CardContent, } from "@mui/material";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI from "../APIs/ingredientAPI";
import UserNavbar from './UserNavbar';

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        recipeAPI.getRecipes()
        .then(response => {
            if (Array.isArray(response)) {
                setRecipes(response);
            } else {
                console.error("Unexpected API response:", response);
                setRecipes([]); // Set empty array if response is invalid
            }
        })
        .catch(error => {
            console.error("Error fetching recipes:", error);
            setRecipes([]); // Avoid breaking UI on failure
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
            {/* HEADING */}
            <Typography variant="h2" className= "bouncing-txt"
                sx={{
                    color: "#ffffff",
                    marginTop: "2%",
                    width: "100%",
                    fontFamily: "'Luckiest Guy', static",
                }}>
                    All Recipes
            </Typography>

            {/* RECIPE LIST */}
            <Box sx={{width: '55%', marginLeft: '20%', marginTop: '3%', border: '1', }}>
                <Grid container spacing={3} sx={{ width: '1000px', marginLeft: '-140px',justifyContent: 'space-between', paddingTop: '40px',}}>
                    {recipes?.map(recipe => (
                        <Grid recipe xs={9} sm={5} md={3} key={recipe.id} onClick={() => handleOpen(recipe)}>
                            <Card className="cards" sx={{ width: '300px', cursor: 'pointer',}}>
                                <CardContent>
                                    <Typography variant="h4" fontWeight="bold">{recipe.name}</Typography>
                                    <Typography variant="h6">{recipe.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* RECIPE DETAIL DIALOGUE */}
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

export default AllRecipes;
