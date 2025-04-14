import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const ConfirmDeleteDialog = ({ open, onCancel, onConfirm }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to delete this recipe?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDeleteDialog;
