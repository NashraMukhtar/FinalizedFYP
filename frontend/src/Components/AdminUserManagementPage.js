// src/pages/AdminUserManagement.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, CircularProgress, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';
import { Delete, Visibility } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authAPI from '../APIs/authAPI';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [selectedUserActivity, setSelectedUserActivity] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await authAPI.getAllUsers(token);
      const sortedUsers = [...res].sort(
        (a, b) => b.grocery_items_count - a.grocery_items_count
      );
      setUsers(sortedUsers);
    } catch (err) {
      toast.error('Failed to fetch users');
    }
    setLoading(false);
  };

  const handleViewActivity = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await authAPI.getUserActivity(token, userId);
      console.log(res);
      setSelectedUserActivity(res);
      setActivityDialogOpen(true);
    } catch (err) {
      toast.error('Failed to fetch user activity');
    }
  };

  const handleOpenDeleteDialog = (userId) => {
    setSelectedUserId(userId);
    setDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await authAPI.deleteUser(token, selectedUserId);
      toast.success("User Deleted Successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const chartData = selectedUserActivity ? [
    { name: "Grocery", count: selectedUserActivity.grocery_items.length },
    { name: "Shopping", count: selectedUserActivity.shopping_items.length },
    { name: "Recipes", count: selectedUserActivity.recipes.length },
  ] : [];

  return (
    <Box p={3} sx={{backgroundColor: '#292F36', minHeight: '100vh', margin: '-8px'}}>
      <ToastContainer 
        autoClose={2000}
      />
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#FFA500" paddingTop="15px" paddingBottom="15px">
        Admin: User Management
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{
              position: 'sticky',
              top: 0,
              backgroundColor: '#FFA500',
              zIndex: 1
            }}>
              <TableRow>
                <TableCell><b className='user-management-table-header'>Sr No.</b></TableCell>
                <TableCell><b className='user-management-table-header'>ID</b></TableCell>
                <TableCell><b className='user-management-table-header'>Username</b></TableCell>
                <TableCell><b className='user-management-table-header'>Email</b></TableCell>
                <TableCell><b className='user-management-table-header'>Role</b></TableCell>
                <TableCell><b className='user-management-table-header'>Status</b></TableCell>
                <TableCell><b className='user-management-table-header'>Last Login</b></TableCell>
                <TableCell><b className='user-management-table-header'>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...users]
              .sort((a, b) => (b.grocery_items_count || 0) - (a.grocery_items_count || 0))
              .map((user, index) => (
                <TableRow key={user.id} sx={{backgroundColor:'#1E1E1E', borderBottom:'1px solid gray'}}>
                  <TableCell sx={{color:'white'}}>{index + 1}</TableCell>
                  <TableCell sx={{color:'white'}}>{user.id}</TableCell>
                  <TableCell sx={{color:'white'}}>{user.username}</TableCell>
                  <TableCell sx={{color:'white'}}>{user.email}</TableCell>
                  <TableCell sx={{color:'white'}}>{user.role}</TableCell>
                  <TableCell sx={{color:'white'}}>{user.is_active ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell sx={{color:'white'}}>
                    {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewActivity(user.id)}  color="primary">
                      <Visibility />
                    </IconButton>
                    {user.role !== 'admin' && (
                      <IconButton onClick={() => handleOpenDeleteDialog(user.id)} color="error">
                        <Delete />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* User Activity Dialog */}
      <Dialog open={activityDialogOpen} onClose={() => setActivityDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>User Activity</DialogTitle>
        <DialogContent dividers>
          {selectedUserActivity ? (
            <>
              <Typography><b>Username:</b> {selectedUserActivity.user.username}</Typography>
              <Typography><b>Total Grocery Items:</b> {selectedUserActivity.grocery_items.length}</Typography>
              <Typography><b>Total Shopping Items:</b> {selectedUserActivity.shopping_items.length}</Typography>
              <Typography><b>Total Recipes:</b> {selectedUserActivity.recipes.length}</Typography>
              <Typography variant="h6" sx={{ mt: 3 }}>Activity Overview</Typography>
              {/* BAR CHART */}
                <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>

              <Typography><b>Recipes:</b></Typography>
              <ul>
                {selectedUserActivity.recipes.map((r) => (
                  <li key={r.id}>
                    {r.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Typography>Loading activity...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivityDialogOpen(false)}>Close</Button>
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

export default AdminUserManagement;
