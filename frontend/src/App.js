import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './access_permissions/ProtectedRoute';
import Login from './Components/Login';
import Logout from './Components/Logout';
import ShoppingList from './Components/ShoppingList';
import GroceryList from './Components/GroceryList';
import AdminPanel from './Components/AdminPanel';
import Unauthorized from './Components/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} /> //public route
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/logout" element={<Logout />} />
          </Route> //auth protection

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute userOnly={true} />}>
            <Route path="/home" element={<GroceryList />} />
          </Route>

          {/* <Route path="/admin-panel" element={
          <ProtectedRoute adminOnly ={true}>
            <AdminPanel />
          </ProtectedRoute>} /> //admin protection */}

            {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin-panel" element={<AdminPanel />} />
          </Route>

          {/* <Route path="/" exact element={<Home />} /> //public route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
