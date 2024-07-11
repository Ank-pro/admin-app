import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import AdminLoginForm from './AdminLogin/AdminForm';
import './App.css';
import { AdminDashBoard } from './dashboard/AdminDashboard';
import { useContext } from 'react';
import { AuthContext } from './AdminLogin/AuthContext';
import { cookies } from './api';

function App() {
  const { isAuthenticated, login } = useContext(AuthContext);

 

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <Route 
            path="/admin" 
            element={<AdminLoginForm />} 
          />
        ) : (
          <Route 
            path="/dashboard" 
            element={<AdminDashBoard />} 
          />
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/admin"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
