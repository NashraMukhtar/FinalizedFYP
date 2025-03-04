import React, { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import shoppingAPI from '../APIs/shoppingAPI'; // Adjust the import as needed
import { Delete, CheckCircle } from '@mui/icons-material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ingredientsAPI from '../APIs/ingredientAPI'; // Ensure you have this API for fetching ingredients

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null); // Updated to store selected ingredient
  const [error, setError] = useState('');
  const token = localStorage.getItem('token'); // Make sure to manage token appropriately

  useEffect(() => {
    const fetchShoppingItems = async () => {
      const items = await shoppingAPI.getShoppingItems(token);
      setShoppingItems(items);
    };

    const fetchIngredients = async () => {
      const ingredientList = await ingredientsAPI.getIngredients(token); // Fetch the list of ingredients
      setIngredients(ingredientList);
    };

    fetchShoppingItems();
    fetchIngredients();
  }, [token]);

  const handleAddItem = async () => {
    if (!selectedIngredient) {
      setError('Please select an ingredient!');
      return;
    }
  
    try {
      const newItem = { ingredient: selectedIngredient.id };
      await shoppingAPI.addShoppingItem(newItem, token);
      setError('');
      setSelectedIngredient(null);
  
      // Refresh shopping items after adding the new item
      const items = await shoppingAPI.getShoppingItems(token);
      setShoppingItems(items); // Update state with the new list of shopping items
      toast.success('Item added to shopping list!', {
        position: 'top-right',
      });
    } catch (err) {
      toast.error('Error adding item to shopping list!', {
        position: 'top-right',
      });
    }
  };
  
  const handleDeleteItem = async (id) => {
    await shoppingAPI.deleteShoppingItem(id, token);
    const items = await shoppingAPI.getShoppingItems(token);
    setShoppingItems(items);
    toast.success('Item deleted!', {
      position: 'top-right',
    });
  };

  const handleMoveToGroceryList = async (id) => {
    try {
        const response = await shoppingAPI.moveToGroceryList(id, token);
        console.log('API Response:', response);
      
        if (response && response.success) {
          const items = await shoppingAPI.getShoppingItems(token);
          setShoppingItems(items);
      
          toast.success('Item moved to grocery list!', {
            position: 'top-right',
          });
        } else {
          throw new Error(response?.error || 'Unable to move item to grocery list.');
        }
      } catch (err) {
        console.error("Error occurred:", err);
        
        // Handle Axios error
        if (err.response) {
          const errorMessage = err.response.data.error || 'Error moving item to grocery list!';
          toast.error(errorMessage, {
            position: 'top-right',
          });
        } else {
          toast.error('Network error, please try again.', {
            position: 'top-right',
          });
        }
      }      
  };
  
  return (
    <Container
      maxWidth="md"
      style={{
        backgroundColor: '#A7DFC1',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        marginTop: '50px',
      }}
    >
      <ToastContainer />
      <Typography variant="h4" style={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Shopping List
      </Typography>

      {/* Single Field Searchable Dropdown for Ingredients */}
      <Autocomplete
        options={ingredients}
        getOptionLabel={(option) => option.name}
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
        style={{ marginBottom: '20px' }}
      />

      {error && (
        <Typography variant="body2" color="error" style={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddItem}
        style={{
          width: '100%',
          marginBottom: '20px',
          backgroundColor: '#088484',
        }}
      >
        Add Item
      </Button>

      <List>
        {shoppingItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText primary={item.ingredient_name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleMoveToGroceryList(item.id)}>
                <CheckCircle color="success" />
              </IconButton>
              <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                <Delete color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ShoppingList;
