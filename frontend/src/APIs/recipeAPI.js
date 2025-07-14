import Axios from "axios";

// const API_URL = 'http://localhost:8000/';
const API_URL = process.env.REACT_APP_API_URL;

const recipeAPI = {
  getRecipes: async () => {
    try {
      const res = await Axios.get(`${API_URL}recipes/`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  addRecipe: async (recipe, token) => {
    try {
      const res = await Axios.post(`${API_URL}recipes/`, recipe, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateRecipe: async (id, recipe, token) => {
    try {
      const res = await Axios.put(`${API_URL}recipes/${id}/`, recipe, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) { 
      throw err;
    }
  },
  deleteRecipe: async (id, token) => {
    try {
      const res = await Axios.delete(`${API_URL}recipes/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getUserRecipes: async (token) => {
    try {
      const res = await Axios.get(`${API_URL}my-recipes/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getSuggestedRecipes: async (token) => {
    try {
      const res = await Axios.get(`${API_URL}suggest-recipes/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw(err);
    }
  },
  getCategories: async () => {
    try {
      const res = await Axios.get(`${API_URL}categories/`);
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  getRecipeRequests: async (token) => {
    try {
      const res = await Axios.get(`${API_URL}recipe-requests/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  createRequest: async (recipe, token) => {
    try {
      const res = await Axios.post(`${API_URL}submit-recipe-request/`, recipe, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  approveRecipe: async (id, token) => {
    try {
      const res = await Axios.post(`${API_URL}recipe-requests/${id}/approve/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) { 
      throw err;
    }
  },
  rejectRecipe: async (id, token) => {
    try {
      const res = await Axios.post(`${API_URL}recipe-requests/${id}/reject/`, {}, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) { 
      throw err;
    }
  },
};

export default recipeAPI;
