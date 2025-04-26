import Axios from "axios";

const API_URL = 'http://localhost:8000/';

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
      console.log(err);
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
};

export default recipeAPI;
