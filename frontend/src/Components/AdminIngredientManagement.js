import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Card, CardContent, Typography,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ingredientAPI from '../APIs/ingredientAPI';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const IngredientManagement = () => {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState(null);

  const fetchIngredients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await ingredientAPI.getIngredients(token);
      setIngredients(res);
    } catch (err) {
      toast.error('Failed to fetch ingredients');
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleAddIngredient = async () => {
    const trimmed = newIngredient.trim();

    if (!trimmed) {
        toast.warning('Please enter a valid ingredient name');
        return;
    }

    const isValidName = /^[a-zA-Z\s]+$/.test(trimmed);
    if (!isValidName) {
        toast.warning('Ingredient name must only contain letters');
        return;
    }

    setLoadingAdd(true);
    try {
      const token = localStorage.getItem("token");
      const response = await ingredientAPI.create(token, { name: trimmed });

      toast.success('Ingredient added!');
      setNewIngredient('');
      fetchIngredients();
    } catch (err) {
      if (err.response?.status === 400) {
        toast.error('Ingredient already exists or is invalid');
      } else {
        toast.error('Error adding ingredient');
      }
    } finally {
      setLoadingAdd(false);
    }
  };

  const openEditDialog = (ingredient) => {
    setEditingIngredient(ingredient);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await ingredientAPI.update(editingIngredient.id, token, { name: editingIngredient.name });
      toast.success('Ingredient updated!');
      setEditDialogOpen(false);
      fetchIngredients();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setIngredientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setIngredientToDelete(null);
  };

  const handleConfirmDelete = async () => {
      try {
        const token = localStorage.getItem("token");
        await ingredientAPI.delete(ingredientToDelete, token);
        toast.success('Ingredient deleted!');
        fetchIngredients();
      } catch (err) {
        toast.error("Error deleting user");
      } finally {
        setDeleteDialogOpen(false);
        setIngredientToDelete(null);
      }
    };

  const filteredIngredients = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 6, backgroundColor: '#121212', minHeight: '100vh', color: 'white', margin:'-8px' }}>
        <ToastContainer 
            autoClose={2000}
        />
      <Typography variant="h4" sx={{ color: '#FFA500', mb: 4, fontWeight: 'bold', letterSpacing: 1 }}>
        Ingredient Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Add New Ingredient"
          variant="outlined"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          fullWidth
          InputLabelProps={{ style: { color: '#ccc' } }}
          InputProps={{ style: { color: 'white' } }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#555' },
              '&:hover fieldset': { borderColor: '#999' },
              '&.Mui-focused fieldset': { borderColor: '#FFA500' },
            },
          }}
        />
        <Button
          variant="contained"
          color="warning"
          onClick={handleAddIngredient}
          disabled={loadingAdd}
          sx={{ fontWeight: 'bold', borderRadius: '8px', minWidth: 150 }}
        >
          {loadingAdd ? 'Adding...' : 'Add'}
        </Button>
      </Box>

      <TextField
        label="Search Ingredients"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        InputLabelProps={{ style: { color: '#ccc' } }}
        InputProps={{ style: { color: 'white' } }}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#555' },
            '&:hover fieldset': { borderColor: '#999' },
            '&.Mui-focused fieldset': { borderColor: '#FFA500' },
          },
        }}
      />

      {filteredIngredients.length === 0 ? (
        <Typography sx={{ color: '#888' }}>No ingredients found.</Typography>
      ) : (
        filteredIngredients.map((ingredient) => (
          <Card
            key={ingredient.id}
            sx={{
              backgroundColor: '#1e1e1e',
              mb: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(255, 165, 0, 0.2)',
            }}
          >
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {ingredient.name}
              </Typography>
              <Box>
                <IconButton onClick={() => openEditDialog(ingredient)} color="warning">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleOpenDeleteDialog(ingredient.id)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <TextField
            value={editingIngredient?.name || ''}
            onChange={(e) =>
              setEditingIngredient({ ...editingIngredient, name: e.target.value })
            }
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditSave} color="warning" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
      <ConfirmDeleteDialog
              open={deleteDialogOpen}
              onCancel={handleCancelDelete}
              onConfirm={handleConfirmDelete}
              />
    </Box>
  );
};

export default IngredientManagement;
