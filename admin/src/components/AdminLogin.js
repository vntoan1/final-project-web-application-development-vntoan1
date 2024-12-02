import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Import file CSS của AdminLogin

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Kiểm tra thông tin đăng nhập với email và mật khẩu cố định
    if (email === 'admin@gmail.com' && password === 'admin123') {
      navigate('/admin'); // Chuyển hướng đến trang AdminDashboard
    } else {
      setError('Thông tin đăng nhập không chính xác!');
    }
  };

  return (
    <div className="login-register-container">
      <form onSubmit={handleLogin}>
        <h2>Đăng nhập Admin</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng Nhập</button>
      </form>
    </div>
  );
};

export default AdminLogin;
