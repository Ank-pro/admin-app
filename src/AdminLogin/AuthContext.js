import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

const AuthContext = createContext();

const cookies = new Cookies();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.get("TOKEN"));

  useEffect(() => {
    const token = cookies.get("TOKEN");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token) => {
    cookies.set("TOKEN", token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    cookies.remove("TOKEN");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
