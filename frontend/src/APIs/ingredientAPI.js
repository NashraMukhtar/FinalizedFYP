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
      console.log("from ingredientAPI:",err);
    }
  },
};

export default ingredientAPI;
