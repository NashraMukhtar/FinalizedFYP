import { createContext, useState, useEffect } from "react";
import authAPI from "../APIs/authAPI";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user details if token exists
    if (token) {
      setLoading(true);
      authAPI.getUserDetails(token)
        .then((data) => {
          setUser(data);
          setIsUserAdmin(data.role === "admin"); // Check if the user is admin
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
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
    <AuthContext.Provider value={{ user, token, isUserAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
