import React, { useEffect, useState } from 'react';
import groceryAPI from '../APIs/groceryAPI';
import ingredientAPI from '../APIs/ingredientAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid, Card, CardContent, CardActions,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import UserNavbar from './UserNavbar';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const GroceryList = () => {
    const [groceryItems, setGroceryItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ingredientLoading, setIngredientLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);  // State for dialog
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch grocery items on component mount
    useEffect(() => {
        const fetchGroceryItems = async () => {
            const token = localStorage.getItem("token");
            const items = await groceryAPI.getGroceryItems(token);
            setGroceryItems(items || []);
            setLoading(false);
        };

        fetchGroceryItems();
    }, []);

    // Fetch ingredient list on component mount
    useEffect(() => {
        const fetchIngredients = async () => {
            const token = localStorage.getItem("token");
            const ingredientsList = await ingredientAPI.getIngredients(token);
            setIngredients(ingredientsList.map(ingredient => ({
                value: ingredient.id,
                label: ingredient.name
            })));
            setIngredientLoading(false);
        };

        fetchIngredients();
    }, []);

    // Function to refresh grocery list after adding or deleting items
    const refreshGroceryList = async () => {
        const token = localStorage.getItem("token");
        const items = await groceryAPI.getGroceryItems(token);
        setGroceryItems(items || []);
    };

    // Handle adding a grocery item
    const handleAddItem = async () => {
        if (!selectedIngredient) {
            toast.error("Please select an ingredient");
            return;
        }

        const itemExists = groceryItems.some(item => item.ingredient === selectedIngredient.value);
    
        if (itemExists) {
            toast.error("This ingredient already exists in your grocery list");
            setSelectedIngredient(null);
            return;
    }

        const token = localStorage.getItem("token");
        const item = { ingredient: selectedIngredient.value };  // Send ingredient ID
        const response = await groceryAPI.addGroceryItem(item, token);

        if (response) {
            toast.success("Item added successfully");
            refreshGroceryList();  // Refresh the grocery list after adding the item
        } else {
            setError("Failed to add item to grocery list");
            toast.error("Failed to add item");
        }

        setSelectedIngredient(null);  // Clear the input field after adding
    };

    const handleOpenDialog = (item) => {
      setItemToDelete(item);
      setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
      setOpenDialog(false);
      setItemToDelete(null);
  };

  // Confirm the deletion of the item
  const handleConfirmDelete = async () => {
      const token = localStorage.getItem("token");
      await groceryAPI.deleteGroceryItem(itemToDelete.id, token);
      setGroceryItems(groceryItems.filter(item => item.id !== itemToDelete.id));
      toast.success("Item deleted successfully");
      handleCloseDialog();  // Close the dialog after deletion
  };


    if (loading || ingredientLoading) return <div style={{marginTop:'15%',marginLeft:'45%',fontSize:'larger', fontWeight:'bolder'}}>Loading...</div>;

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

      {/* HEADLINE */}
      <Typography variant="h2" className= "bouncing-txt" sx={{
        fontFamily: "'Luckiest Guy', static",
        color: "#ffffff",
        marginTop: "3%",
        width: "100%",
      }}>
        Grocery List
      </Typography>

      {/* SEARCHBAR, BUTTON, LIST */}
      <Box sx={{width: '55%', marginLeft: '20%', marginTop: '3%', }}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
              {/* SEARCHBAR */}
                <Box>
                  <Autocomplete
                    options={ingredients}
                    getOptionLabel={(option) => option.label}
                    value={selectedIngredient}
                    onChange={(event, newValue) => {
                      setSelectedIngredient(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Ingredient"
                        variant="outlined"
                        placeholder="Search and select an ingredient..."
                      />
                    )}
                    fullWidth
                    style={{ marginBottom: '15px', background: 'smokeWhite', width: '450px', }}
                  />

                  {error && (
                    <Typography variant="body2" color="error" style={{ textAlign: 'center' }}>
                      {error}
                    </Typography>
                  )}
                </Box>

              {/* ADD-ITEM BUTTON */}
              <Box>
              <Button
                className={"button add-item"}
                onClick={handleAddItem}
                sx={{
                  border: '1px solid white',
                  marginTop: '8px',
                  marginRight: '30px',
                }}
              >
                Add Item
              </Button>
              </Box>
            </Box>

            {/* GROCERY ITEMS LIST */}
                  {groceryItems.length > 0 ? (
                    <Grid container spacing={3} sx={{ width: '1000px', marginLeft: '-140px', }}>
                    {groceryItems.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{
                          border: '1px solid #8c8c8c',
                          padding: '10px',
                          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                          boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0px 10px 20px 3px rgba(236, 104, 133, 0.9)',
                          }
                        }}>
                          <CardContent>
                            <Typography variant="h5">{item.ingredient_name}</Typography>
                          </CardContent>
                          <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton onClick={() => handleOpenDialog(item)}>
                              <Delete color="error" />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                      ))}
                  </Grid>
                ) : (
                  <p class='add-item-to-view-list'>No items found.<br></br> Start Adding Items!</p>
                )}
                {/* Delete Confirmation Dialog */}
                {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this item?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirmDelete} color="secondary">
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog> */}
                <ConfirmDeleteDialog
                        open={openDialog}
                        onCancel={() => setOpenDialog(false)}
                        onConfirm={handleConfirmDelete}
                      />
                {/* <ToastContainer /> */}
            </Box>
        </Container>
    );
};

export default GroceryList;
