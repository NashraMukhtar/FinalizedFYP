import Axios from "axios";

// const API_URL = 'http://localhost:8000/core/';
const API_URL = 'https://finalizedfyp.onrender.com/core/';

const authAPI = {
    login: async (username, password) => {
      try {
        const res = await Axios.post(`${API_URL}login/`, {
          username,
          password,
        });
        return res.data;
      } catch (err) {
        throw(err);
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
        throw err;
      }
    },
    getAllUsers: async(token) => {
      try{
        const res = await Axios.get(`${API_URL}all-users/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    getUserActivity: async(token, userId) => {
      try {
        const res = await Axios.get(`${API_URL}users/${userId}/activity/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    deleteUser: async(token, userId) => {
      try {
        const res = await Axios.delete(`${API_URL}users/${userId}/delete/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    getDashboardCounts: async(token) => {
      try {
        const res = await Axios.get(`${API_URL}dashboard-counts/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    extractGrocery: async (token, formData) => {
      try {
        const res = await Axios.post(`${API_URL}extract-grocery/`, formData, {
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
  
  export default authAPI;
