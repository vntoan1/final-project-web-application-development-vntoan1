import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './components/AdminLogin'; // Đảm bảo AdminLogin đã được import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} /> {/* Trang đăng nhập Admin */}
        <Route path="/" element={<AdminDashboard />} /> {/* Trang quản trị Admin */}
      </Routes>
    </Router>
  );
};

export default App;
