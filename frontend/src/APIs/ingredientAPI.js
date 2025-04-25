import Axios from "axios";

const API_URL = 'http://localhost:8000/';

const ingredientAPI = {
  getIngredients: async (token) => {
    try {
      const res = await Axios.get(`${API_URL}ingredients/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  create: async (token, item) => {
    try {
      const res = await Axios.post(`${API_URL}ingredients/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  update: async (id, token, item) => {
    try {
      const res = await Axios.put(`${API_URL}ingredients/${id}/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  delete: async (id, token) => {
    try {
      const res = await Axios.delete(`${API_URL}ingredients/${id}/`, {
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

export default ingredientAPI;
