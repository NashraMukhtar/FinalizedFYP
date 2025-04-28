import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Box, Typography, Grid, Card, CardContent,TextField,FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI from "../APIs/ingredientAPI";
import UserNavbar from './UserNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const AllRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [open, setOpen] = useState(false);
    const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
    const [currentRecipe, setCurrentRecipe] = useState({
        title: "",
        description: "",
        instructions: "",
        category: "",
        ingredients: [],
    });
    const [ingredientMap, setIngredientMap] = useState({});
    const [categoryList, setCategoryList] = useState([]);

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

                const map = {};
                data.forEach(item => {
                map[item.id] = item.name;
                });
                setIngredientMap(map);
            } else {
              console.error("Unexpected ingredient data format", data);
            }
          })
          .catch((error) => console.error("Error fetching ingredients:", error));
    }, []);

      useEffect(() => {
        fetchCategories();
      }, []);

  const fetchCategories = async () => {
    try {
      const res = await recipeAPI.getCategories();
      setCategoryList(res);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

    const handleOpen = (recipe) => {
        setSelectedRecipe(recipe);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedRecipe(null);
    };

    const handleSubmit = async () => {
        try {
          const token = localStorage.getItem('token');
          const payload = {
            ...currentRecipe,
            ingredients: currentRecipe.ingredients.map((ri) => ri.ingredient),
          };
          
          await recipeAPI.createRequest(payload, token); 
          toast.success("Recipe Request Sent to the Admin!");
          setOpenRecipeDialog(false);
          setCurrentRecipe({ title: "", description: "",category: "", instructions: "", ingredients: [] });
        } catch (error) {
          console.error(error);
          toast.error("Failed to send recipe request.");
        }
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

                  <ToastContainer 
                   autoClose={2000}
                  />

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

            {/*REQUEST RECIPE BUTTON*/}
            <Box sx={{marginLeft: '35%', marginBottom:2, textAlign: 'center', width: '30%'}}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RestaurantMenuIcon />}
                sx={{
                  backgroundColor: '#ff3cac',
                  backgroundImage: 'linear-gradient(225deg, #ff3cac 0%, #784ba0 50%, #2b86c5 100%)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderRadius: '16px',
                  border: "1px solid white",
                  boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.25)',
                  textTransform: 'none',
                  padding: '10px 20px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.35)',
                    backgroundImage: 'linear-gradient(225deg, #ff0080 0%, #7928ca 50%, #2b86c5 100%)',
                  },
                }}
                onClick={() => setOpenRecipeDialog(true)}
              >
                Request a Recipe
              </Button>
            </Box>

            {/* RECIPE LIST */}
            {/* <Box sx={{width: '55%', marginLeft: '20%', marginTop: '3%', border: '1', }}> */}
                <Grid container spacing={2} sx={{ marginTop: 2, width: '80%', marginLeft:'10%'}}>
                    {recipes?.map(recipe => (
                        <Grid item xs={12} sm={6} md={4} key={recipe.id} onClick={() => handleOpen(recipe)}>
                            <Card className="cards" 
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
                            }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">{recipe.name}</Typography>
                                    <Typography variant="body2">
                                    {recipe.description.split(" ").slice(0, 3).join(" ") + (recipe.description.split(" ").length > 3 ? "..." : "")}
                                    </Typography>
                                    <Typography variant="body2">Category: {recipe.category_name}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            {/* </Box> */}

            {/* RECIPE DETAIL DIALOG */}
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
                    <Typography variant="body2" mt={3} sx={{ marginBottom: '10px', color: '#333' }}>
                    <strong>Category: {selectedRecipe?.category_name}</strong>
                    </Typography>
                    
                    <Typography variant="h6" mt={4} sx={{ marginBottom: '10px', color: '#333' }}>
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

            {/* REQUEST RECIPE DIALOG */}
            <Dialog open={openRecipeDialog} onClose={() => setOpenRecipeDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Recipe</DialogTitle>

                <DialogContent>
                    {/* Name Field */}
                    <TextField
                    autoFocus
                    margin="dense"
                    label="Ttile"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={currentRecipe.title || ""}
                    onChange={(e) => setCurrentRecipe({ ...currentRecipe, title: e.target.value })}
                    />

                    {/* Description Field */}
                    <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={currentRecipe.description || ""}
                    onChange={(e) => setCurrentRecipe({ ...currentRecipe, description: e.target.value })}
                    />

                    {/* Category Select - (Optional for Requests, we can hide it if you want) */}
                    <FormControl margin="dense" fullWidth>
                    <InputLabel id="category-label">Select Category</InputLabel>
                    <Select
                        labelId="category-label"
                        value={currentRecipe.category || ""}
                        onChange={(e) => setCurrentRecipe({ ...currentRecipe, category: e.target.value })}
                        label="Select Category"
                    >
                        <MenuItem value="" disabled>Select a category</MenuItem>
                        {categoryList.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>

                    {/* Steps Field */}
                    <TextField
                    margin="dense"
                    label="Instructions"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={currentRecipe.instructions || ""}
                    onChange={(e) => setCurrentRecipe({ ...currentRecipe, instructions: e.target.value })}
                    />

                    {/* Ingredient Multi-Select */}
                    <FormControl margin="dense" fullWidth>
                    <InputLabel>Add Ingredients</InputLabel>
                    <Select
                        value=""
                        onChange={(e) => {
                        const selectedId = e.target.value;
                        const existingIds = currentRecipe.ingredients?.map((ri) => ri.ingredient) || [];

                        if (!existingIds.includes(selectedId)) {
                            const newIngredient = { ingredient: selectedId };
                            setCurrentRecipe({
                            ...currentRecipe,
                            ingredients: [...(currentRecipe.ingredients || []), newIngredient],
                            });
                        }
                        }}
                    >
                        <MenuItem value="" disabled sx={{ display: "none" }} />
                        {ingredients.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>

                    {/* Selected Ingredients */}
                    {(currentRecipe.ingredients || []).length > 0 && (
                    <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                        {currentRecipe.ingredients.map((ri, index) => (
                        <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                            <span style={{ flex: 1 }}>{ingredientMap[ri.ingredient] || `ID ${ri.ingredient}`}</span>
                            <Button
                            size="small"
                            color="error"
                            onClick={() => {
                                const updatedIngredients = currentRecipe.ingredients.filter((_, i) => i !== index);
                                setCurrentRecipe({ ...currentRecipe, ingredients: updatedIngredients });
                            }}
                            >
                            Delete
                            </Button>
                        </li>
                        ))}
                    </ul>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenRecipeDialog(false)}>Cancel</Button>
                    <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{ backgroundColor: '#4682B4' }}
                    >
                    Request
                    </Button>
                </DialogActions>
                </Dialog>

        </Container>
    );
};

export default AllRecipes;
