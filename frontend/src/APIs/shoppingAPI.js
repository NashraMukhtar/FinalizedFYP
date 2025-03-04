import Axios from "axios";

const API_URL = 'http://localhost:8000/';

const shoppingAPI = {
  getShoppingItems: async (token) => {
    try {
      const res = await Axios.get(`${API_URL}shopping-items/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  addShoppingItem: async (item, token) => {
    try {
      const res = await Axios.post(`${API_URL}shopping-items/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  updateShoppingItem: async (id, item, token) => {
    try {
      const res = await Axios.put(`${API_URL}shopping-item/${id}/`, item, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.log("from shoppingAPI:",err);
    }
  },
  deleteShoppingItem: async (id, token) => {
    try {
      const res = await Axios.delete(`${API_URL}shopping-item/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      console.log("from shoppingAPI:",err);
    }
  },
  moveToGroceryList: async (id, token) => {
    try {
      const res = await Axios.post(`${API_URL}shopping-item/${id}/move-to-grocery/`, null, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log("from shoppingAPI 61:",res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};

export default shoppingAPI;
