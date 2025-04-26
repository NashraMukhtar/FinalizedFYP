import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import recipeAPI from "../APIs/recipeAPI";
import ingredientAPI from "../APIs/ingredientAPI";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
// import AdminNavbar from "./AdminNavbar";

const AdminRecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState({
    name: "",
    description: "",
    steps: "",
    category: "",
    recipe_ingredients: [],
  });
  const [ingredientList, setIngredientList] = useState([]);
  const [ingredientMap, setIngredientMap] = useState({});
  const [categoryList, setCategoryList] = useState([]);


  // Modern Industrial Colors
  const colors = {
    background: "#292F36",
    card: "#1E1E1E",
    text: "#D3D3D3",
    accent: "#4682B4",
    highlight: "#FFBF00",
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await ingredientAPI.getIngredients(token);
  
        setIngredientList(res);
        console.log(res);
  
        const map = {};
        res.forEach(item => {
          map[item.id] = item.name;
        });
        setIngredientMap(map);
        console.log("ingredientMap:", ingredientMap);
      } catch (err) {
        console.error("Failed to fetch ingredients:", err);
      }
    };
  
    fetchIngredients();
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await recipeAPI.getRecipes();
      setRecipes(res);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipes([]); // fallback to prevent undefined error
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await recipeAPI.getCategories();
      console.log(res);
      setCategoryList(res);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleOpenDialog = () => {
    setEditMode(false);
    setCurrentRecipe({
      name: "",
      description: "",
      steps: "",
      category: 1,
      recipe_ingredients: [],
    });
    setOpenDialog(true);
  };

  const handleEdit = (recipe) => {
    setEditMode(true);
    setCurrentRecipe(recipe);
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (id) => {
    setRecipeToDelete(id);
    setOpenDeleteDialog(true);
  };
  
  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await recipeAPI.deleteRecipe(recipeToDelete, token);
      toast.success("Recipe deleted successfully!");
      fetchRecipes();
      setOpenDeleteDialog(false);
      setRecipeToDelete(null);
    } catch (error) {
      toast.error("Error deleting recipe!");
      console.error("Error deleting recipe:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      //CHECK FOR EMPTY TITLE AND DESCRIPTION
      if (!currentRecipe.name?.trim() && !currentRecipe.description?.trim() && !currentRecipe.steps?.trim()) {
        toast.error("Form cannot be empty!");
        return;
      }
      if (!currentRecipe.name?.trim()) {
        toast.error("Please add a Title.");
        return;
      }
      if (!currentRecipe.description?.trim()) {
        toast.error("Please add a Description.");
        return;
      }
      if (!currentRecipe.steps?.trim()) {
        toast.error("Please add Steps.");
        return;
      }
      if (!currentRecipe.category) {
        toast.error("Please select Category.");
        return;
      }

      const token = localStorage.getItem("token");
  
      const formattedRecipe = {
        name: currentRecipe.name,
        description: currentRecipe.description,
        steps: currentRecipe.steps,
        category: currentRecipe.category,
        recipe_ingredients: currentRecipe.recipe_ingredients || [],
      };

      if (editMode) {
        await recipeAPI.updateRecipe(currentRecipe.id, formattedRecipe, token);
        toast.success("Recipe updated successfully!");
      } else {
        await recipeAPI.addRecipe(formattedRecipe, token);
        toast.success("Recipe added successfully!");
      }
  
      setOpenDialog(false);
      fetchRecipes();
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Something went wrong while submitting the recipe.");
    }
  };
  

  return (
    <Container
      maxWidth="false"
      style={{
        background: colors.background,
        color: colors.text,
        minHeight: "100vh",
        padding: "20px",
        margin: '-8px',
      }}
    >
      <ToastContainer 
        autoClose={2000}
      />
      {/* <AdminNavbar/> */}
      {/* Add Recipe Button */}
      <Box display="flex" justifyContent="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            width: '30%',
            fontWeight: '700',
            borderRadius: '10px',
            boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.5)',
            marginTop: '20px',
            color: 'black',
            backgroundColor: colors.highlight,
            '&:hover': { backgroundColor: colors.highlight },
          }}
          onClick={handleOpenDialog}
        >
          Add Recipe
        </Button>
      </Box>

      {/* Recipe DISPLAY Grid */}
      <Grid container spacing={3}
      sx={{width: '85%', marginLeft: '6%',}}
      >
        {recipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card
              sx={{
                background: colors.card,
                color: colors.text,
                transition: "transform 0.2s, box-shadow 0.2s",
                '&:hover': {
                  transform: "scale(1.03)",
                  boxShadow: `0 4px 15px ${colors.highlight}`,
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {recipe.name}
                </Typography>
                <Typography variant="body2" mb={2}>
                  {recipe.description.split(" ").slice(0, 3).join(" ") + (recipe.description.split(" ").length > 3 ? "..." : "")}
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <IconButton color="primary" onClick={() => handleEdit(recipe)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(recipe.id)}>
                    <Delete />
                  </IconButton>

                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Add/Edit Recipe */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        <DialogContent>
          {/* Title Field - disabled during edit */}
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRecipe.name || ""}
            onChange={(e) => setCurrentRecipe({ ...currentRecipe, name: e.target.value })}
            disabled={editMode}
          />

          {/* Description */}
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

          {/* Category Select */}
          <FormControl margin="dense" fullWidth>
            <InputLabel id="category-label">Select Category</InputLabel>
            <Select
              labelId="category-label"
              value={currentRecipe.category || ""}
              onChange={(e) => setCurrentRecipe({ ...currentRecipe, category: e.target.value })}
              label="Select Category"
            >
              <MenuItem value="" disabled>
                Select a category
              </MenuItem>
              {categoryList.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          {/* Steps */}
          <TextField
            margin="dense"
            label="Steps"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentRecipe.steps || ""}
            onChange={(e) => setCurrentRecipe({ ...currentRecipe, steps: e.target.value })}
          />

          {/* Ingredient Multi-Select */}
          <FormControl margin="dense" fullWidth>
            <InputLabel>Add Ingredients</InputLabel>
            <Select
              value={[]}
              onChange={(e) => {
                const selectedIds = e.target.value;
                const existingIds = currentRecipe.recipe_ingredients?.map((ri) => ri.ingredient) || [];

                if (!existingIds.includes(selectedIds)) {
                  const newIngredient = { ingredient: selectedIds };
                  setCurrentRecipe({
                    ...currentRecipe,
                    recipe_ingredients: [...(currentRecipe.recipe_ingredients || []), newIngredient],
                  });
                }
              }}
            >
              <MenuItem value="" disabled sx={{ display: "none" }} />
              {ingredientList.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Display selected ingredients as a list */}
          {(currentRecipe.recipe_ingredients || []).length > 0 && (
            <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
              {currentRecipe.recipe_ingredients.map((ri, index) => (
                <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ flex: 1 }}>{ingredientMap[ri.ingredient] || `ID ${ri.ingredient}`}</span>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const updatedIngredients = currentRecipe.recipe_ingredients.filter(
                        (_, i) => i !== index
                      );
                      setCurrentRecipe({ ...currentRecipe, recipe_ingredients: updatedIngredients });
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ backgroundColor: colors.accent }}
          >
            {editMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
};

export default AdminRecipePage;