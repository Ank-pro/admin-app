import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {api} from '../api';
import './admin.css';
import {Cookies, cookies} from '../api/index'

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldCheck, setFieldCheck] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (email.trim() === '') {
      setFieldCheck(false);
    } else {
      setFieldCheck(!emailRegex.test(email));
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (fieldCheck) {
      setError('Please enter a valid email');
      return;
    }

    try {
      const response = await api.post('/admin/login', { Email: email, Password: password });
      if (response.data.success) {
        cookies.set('TOKEN', response.data.token)
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <span className="error-message">{error}</span>}
        <label>Email</label>
        <input type="email" className="email" onChange={handleEmailChange} value={email} />
        {fieldCheck && <span className="error-message">Invalid email</span>}
        {email.trim() === '' && <span className="empty-field">*Please fill this field</span>}

        <label>Password</label>
        <input
          type="password"
          className="pass"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {!password.trim() && <span className="empty-field">*Please enter password</span>}

        <button className="submitBtn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLoginForm;