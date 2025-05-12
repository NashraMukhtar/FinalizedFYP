import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, CircularProgress, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import { Upload as UploadIcon } from 'lucide-react';
import groceryAPI from '../APIs/groceryAPI';
import authAPI from '../APIs/authAPI';
import ingredientAPI from '../APIs/ingredientAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X as CloseIcon } from 'lucide-react';

const OcrGroceryUpload2 = ({ open, onClose }) => {
  const [image, setImage] = useState(null);
  const [matched, setMatched] = useState([]);
  const [unmatched, setUnmatched] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [errorItems, setErrorItems] = useState([]);
  const [addedItems, setAddedItems] = useState([]);

  const resetStates = () => {
    setImage(null);
    setMatched([]);
    setUnmatched([]);
    setLoading(false);
    setErrorItems([]);
    setAddedItems([]);
  };

  const handleClose = () => {
    resetStates();
    onClose(); // Let parent handle dialog state
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ingredientAPI.getIngredients(token);
        setIngredients(response);
      } catch (err) {
        console.error("Failed to fetch ingredients", err);
      }
    };
    fetchIngredients();
  }, []);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleExtract = async () => {
    if (!image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const token = localStorage.getItem("token");
      const res = await authAPI.extractGrocery(token, formData);
      setMatched(res.matched);
      setUnmatched(res.unmatched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroceryList = async (item) => {

    const token = localStorage.getItem("token");
    const matchName = item.match.toLowerCase();
  
    const ingredient = ingredients.find(
      (i) => i.name.toLowerCase() === matchName
    );
  
    if (!ingredient) {
      toast.error(`Ingredient "${item.match}" not found`);
      return;
    }
  
    if (addedItems.includes(matchName)) {
      toast.warn(`"${item.match}" is already added.`);
      return;
    }
  
    try {
      const res = await groceryAPI.addGroceryItem({ ingredient: ingredient.id }, token);
  
      if (res.status === 201) {
        toast.success(`"${item.match}" added to grocery list`);
        setAddedItems((prev) => [...prev, matchName]);
        setMatched((prev) => prev.filter((i) => i.match.toLowerCase() !== matchName));
      }
    } catch (err) {
      console.error(err);
      setErrorItems((prev) => [...prev, matchName]);
  
      if (err.response?.status === 400) {
        toast.error(`"${item.match}" is already in your grocery list`);
      } else {
        toast.error(`Failed to add "${item.match}"`);
      }
    }
  };
  
  

  return (
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h5" gutterBottom>📸 Upload Grocery Image</Typography>
                    <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                        <ToastContainer autoClose={2000}/>
                    <Box>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <Button
                        variant="contained"
                        startIcon={<UploadIcon />}
                        onClick={handleExtract}
                        disabled={loading || !image}
                        sx={{ mt: 2 }}
                        >
                        {loading ? <CircularProgress size={24} /> : 'Extract Items'}
                        </Button>

                        {matched.length > 0 && (
                            <Box mt={4}>
                                <Typography variant="h6" gutterBottom>✅ Matched Items</Typography>
                                <Box sx={{ display: 'grid', gap: 2 }}>
                                {matched.map((item, index) => {
                                    const matchName = item.match.toLowerCase();
                                    const isErrored = errorItems.includes(matchName);
                                    const isAdded = addedItems.includes(matchName);

                                    return (
                                    <Box key={index} sx={{
                                        p: 2,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        backgroundColor: isErrored ? '#ffdddd' : 'white'
                                    }}>
                                        <Box>
                                        <Typography><strong>{item.input}</strong> → {item.match}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Match Score: {item.score}%
                                        </Typography>
                                        </Box>
                                        <Button
                                        variant="contained"
                                        color={isErrored ? "error" : "primary"}
                                        onClick={() => handleAddToGroceryList(item)}
                                        disabled={isAdded || isErrored}
                                        sx={{ mt: 1 }}
                                        >
                                        {isAdded ? "✅ Added" : isErrored ? "❌ Error" : "➕ Add"}
                                        </Button>
                                    </Box>
                                    );
                                })}
                                </Box>
                            </Box>
                            )}


                        {unmatched.length > 0 && (
                        <Box mt={4}>
                            <Typography variant="h6">❓ Unmatched Items</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {unmatched.map((item, i) => (
                                <Chip
                                key={i}
                                label={item}
                                color="error"
                                onDelete={() =>
                                    setUnmatched(unmatched.filter((_, idx) => idx !== i))
                                }
                                />
                            ))}
                            </Box>
                        </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>
  );
};

export default OcrGroceryUpload2;
