import Axios from "axios";

const API_URL = 'http://localhost:8000/core/';

const authAPI = {
    login: async (username, password) => {
      try {
        const res = await Axios.post(`${API_URL}login/`, {
          username,
          password,
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    },
    register: async (username, email, password) => {
      try {
        const res = await Axios.post(`${API_URL}register/`, {
          username,
        email,
        password,
        });
        return res.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    logout: async (username) => {
      const res = await Axios.delete(`${API_URL}logout/`, {
        username,
      });
      return res.data;
    },
    getUserDetails: async (token) => {
      try {
        const res = await Axios.get(`${API_URL}get-user/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        return res.data;
      } catch (err) {
        // console.log(err);
        throw err;
      }
    },
  };
  
  export default authAPI;
