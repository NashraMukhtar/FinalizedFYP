import React, { useEffect, useState } from 'react';
import groceryAPI from '../APIs/groceryAPI';
import ingredientAPI from '../APIs/ingredientAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from '@mui/material';
import { CheckCircle, Delete } from '@mui/icons-material';
import { Autocomplete } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
// import Navbar from './Navbar';

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
        // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* <Navbar /> */}
      <ToastContainer 
       autoClose={2000}
      />
      <Typography variant="h2"sx={{
        fontFamily: "'Luckiest Guy', static",
        color: "#ffffff",
        marginTop: "8%",
        width: "100%",
        textAlign: "center",
        display: "inline-block",
        animation: "bounce 1.5s infinite ease-in-out",
        "@keyframes bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}>
        Grocery List
      </Typography>

      <Box sx={{width: '55%', marginLeft: '23%', marginTop: '3%', }}>
            <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',}}>
              {/* Add Grocery Item Section */}
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

            {/* Display Grocery Items */}
                  {groceryItems.length > 0 ? (
                      <List sx={{ maxHeight: '240px', overflowY: 'auto' }}>
                          {groceryItems.map((item) => (
                              <ListItem  key={item.id} sx={{border: '1px solid #8c8c8c', backgroundColor: '#e6e6e6',}}>
                                  <ListItemText primary={item.ingredient_name}/>
                                  <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleOpenDialog(item)}>
                                      <Delete color="error" />
                                    </IconButton>
                                  </ListItemSecondaryAction>
                              </ListItem >
                          ))}
                      </List>
                ) : (
                    <p>No grocery items found.</p>
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

export default GroceryList;
