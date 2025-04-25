import Axios from "axios";

const API_URL = 'http://localhost:8000/';

const groceryAPI = {
  getGroceryItems: async (token, offset, limit) => {
    try {
      const res = await Axios.get(`${API_URL}grocery-items/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
        params: { offset: offset, limit: limit },
      }); // Check the format of the response
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  addGroceryItem: async (item, token) => {
    try {
      const res = await Axios.post(`${API_URL}grocery-items/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  updateGroceryItem: async (id, item, token) => {
    try {
      const res = await Axios.put(`${API_URL}grocery-items/${id}/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  },
  deleteGroceryItem: async (id, token) => {
    try {
      const res = await Axios.delete(`${API_URL}grocery-items/${id}/`, {
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

export default groceryAPI;
