import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // correct import
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // for redirects

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = async (email, password) => {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(errMsg || "Login failed");
    }

    const data = await res.json();
    const decoded = jwtDecode(data.token);

    const userData = {
      id: decoded.id,
      role: decoded.role,
      token: data.token,
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // redirect to dashboard after login
    navigate("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");

    // redirect to landing page after logout
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
