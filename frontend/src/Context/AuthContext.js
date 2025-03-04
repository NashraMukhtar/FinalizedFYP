import { createContext, useState, useEffect } from "react";
import authAPI from "../APIs/authAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(() => {
    // Load user details if token exists
    if (token) {
      console.log(token)
      authAPI.getUserDetails(token)
        .then((data) => {
          setUser(data);
          console.log(data);
          setIsUserAdmin(data.role === "admin"); // Check if the user is admin
        })
        .catch((err) => setUser(null));
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await authAPI.login(username, password);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      // Fetch user details after login
      const userData = await authAPI.getUserDetails(data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", JSON.stringify(userData.role));
      console.log(userData.role);
      setUser(userData);
      setIsUserAdmin(userData.role === "admin");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsUserAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, isUserAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
