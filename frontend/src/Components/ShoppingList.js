import React, { useEffect, useState } from 'react';
import shoppingAPI from '../APIs/shoppingAPI';
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
import { Delete, ShoppingCart } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Navbar from './Navbar';

const ShoppingList2 = () => {
    const [shoppingItems, setShoppingItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ingredientLoading, setIngredientLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);  // State for dialog
    const [itemToDelete, setItemToDelete] = useState(null);

    // Fetch grocery items on component mount
    useEffect(() => {
        const fetchShoppingItems = async () => {
            const token = localStorage.getItem("token");
            const items = await shoppingAPI.getShoppingItems(token);
            setShoppingItems(items || []);
            setLoading(false);
        };

        fetchShoppingItems();
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
    const refreshShoppingList = async () => {
        const token = localStorage.getItem("token");
        const items = await shoppingAPI.getShoppingItems(token);
        setShoppingItems(items || []);
    };

    // Handle adding a grocery item
    const handleAddItem = async () => {
        if (!selectedIngredient) {
            toast.error("Please select an ingredient");
            return;
        }

        const itemExists = shoppingItems.some(item => item.ingredient === selectedIngredient.value);
    
        if (itemExists) {
            toast.error("This ingredient already exists in your shopping list");
            setSelectedIngredient(null);
            return;
    }

        const token = localStorage.getItem("token");
        const item = { ingredient: selectedIngredient.value };  // Send ingredient ID
        const response = await shoppingAPI.addShoppingItem(item, token);

        if (response) {
            toast.success("Item added successfully");
            refreshShoppingList();  // Refresh the shopping list after adding the item
        } else {
            toast.error("Failed to add item");
        }

        setSelectedIngredient(null);  // Clear the input field after adding
    };

    const handleMoveToGrocery = async (id) => {
        try {
          const token = localStorage.getItem("token");
      
          // Check if the item already exists in grocery list
          const groceryListRes = await groceryAPI.getGroceryItems(token);
          const groceryItems = groceryListRes;
      
          const shoppingItem = shoppingItems.find(item => item.id === id);
          const ingredientId = shoppingItem ? shoppingItem.ingredient : null;
      
          if (groceryItems.some(item => item.ingredient === ingredientId)) {
            toast.info("Item already exists in Grocery List!");
            return;
          }
      
          // Move to Grocery List API call
          shoppingAPI.moveToGroceryList(id, token);

          // Remove from Shopping List UI
          setShoppingItems(prevItems => prevItems.filter(item => item.id !== id));
      
          toast.success("Item moved to Grocery List! ");
        } catch (error) {
          setError(error);
          toast.error("Failed to move item.");
        }
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
      await shoppingAPI.deleteShoppingItem(itemToDelete.id, token);
      setShoppingItems(shoppingItems.filter(item => item.id !== itemToDelete.id));
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
      <Navbar />

      <ToastContainer 
       autoClose={2000}
      />

      {/* HEADLINE */}
      <Typography variant="h2" className= "bouncing-txt"
      sx={{
        color: "#ffffff",
        marginTop: "2%",
        width: "100%",
        fontFamily: "'Luckiest Guy', static",
      }}>
        Shopping List
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

            {/* SHOPPING ITEMS GRID */}
                  {shoppingItems.length > 0 ? (
                    <Grid container spacing={3} sx={{ width: '1000px', marginLeft: '-140px', }}>
                    {shoppingItems.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card className="cards">
                          <CardContent>
                            <Typography variant="h5">{item.ingredient_name}</Typography>
                          </CardContent>
                          <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <IconButton onClick={() => handleMoveToGrocery(item.id)}>
                              <ShoppingCart color="primary" />
                            </IconButton>
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
                <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                </Dialog>
                {/* <ToastContainer /> */}
            </Box>
        </Container>
    );
};

export default ShoppingList2;
