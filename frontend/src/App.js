import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './access_permissions/ProtectedRoute';
import Login from './Components/Login';
import ShoppingList from './Components/ShoppingList';
import GroceryList from './Components/GroceryList';
import SuggestRecipes from './Components/SuggestRecipes';
import AdminHomePage from './Components/AdminHomePage';
import AdminNavbar from './Components/AdminNavbar';
import Unauthorized from './Components/Unauthorized';
import AllRecipes from './Components/AllRecipesUsersPage';
import AdminRecipePage from './Components/AdminRecipePage';
import AdminUserManagement from './Components/AdminUserManagementPage';
import IngredientManagement from './Components/AdminIngredientManagement';
import AdminRecipeRequestsPage from './Components/AdminRecipeRequestsPage';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/shopping-list" element={<ShoppingList />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute userOnly={true} />}>
            <Route path="/home" element={<GroceryList />} />
            {/* <Route path="/home" element={<UserHomePage />} /> */}
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute userOnly={true} />}>
            <Route path="/all-recipes" element={<AllRecipes />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute userOnly={true} />}>
            <Route path="/suggest-recipes" element={<SuggestRecipes />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin-navbar" element={<AdminNavbar />} />
          </Route>

            {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin-panel" element={<AdminHomePage />} />
          </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/recipes" element={<AdminRecipePage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/users" element={<AdminUserManagement />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/requests" element={<AdminRecipeRequestsPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/ingredients" element={<IngredientManagement />} />
          </Route>

          {/* <Route path="/" exact element={<Home />} /> //public route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
