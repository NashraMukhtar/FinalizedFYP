import Axios from "axios";

// const API_URL = 'http://localhost:8000/';
const API_URL = process.env.REACT_APP_API_URL;

const authAPI = {
    login: async (username, password) => {
      try {
        const res = await Axios.post(`${API_URL}core/login/`, {
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
        const res = await Axios.post(`${API_URL}core/register/`, {
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
      const res = await Axios.delete(`${API_URL}core/logout/`, {
        username,
      });
      return res.data;
    },
    getUserDetails: async (token) => {
      try {
        const res = await Axios.get(`${API_URL}core/get-user/`, {
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
        const res = await Axios.get(`${API_URL}core/all-users/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    getUserActivity: async(token, userId) => {
      try {
        const res = await Axios.get(`${API_URL}core/users/${userId}/activity/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    deleteUser: async(token, userId) => {
      try {
        const res = await Axios.delete(`${API_URL}core/users/${userId}/delete/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    getDashboardCounts: async(token) => {
      try {
        const res = await Axios.get(`${API_URL}core/dashboard-counts/`, {
          headers: { Authorization: `Token ${token}` },
        });
        return res.data;
      } catch (err) {
        throw err;
      }
    },
    extractGrocery: async (token, formData) => {
      try {
        const res = await Axios.post(`${API_URL}core/extract-grocery/`, formData, {
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
