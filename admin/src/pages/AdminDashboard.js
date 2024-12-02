import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import { auth } from '../firebase'; // Import auth from Firebase
import CategoriesView from '../components/CategoriesView';
import ProductsView from '../components/ProductsView';
import CustomersView from '../components/CustomersView';
import OrdersView from '../components/OrdersView';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('categories');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const renderView = () => {
    switch (activeView) {
      case 'categories':
        return <CategoriesView />;
      case 'products':
        return <ProductsView />;
      case 'customers':
        return <CustomersView />;
      case 'orders':
        return <OrdersView />;
      default:
        return <h2>Chọn mục để quản lý</h2>;
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        // Sau khi đăng xuất, chuyển hướng về trang login
        navigate('/login'); // Use navigate to redirect
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="Logo" className="logo-img" />
        </div>
        <div className="title">
          <h1>Chào mừng đến trang quản trị</h1>
        </div>
        <div className="admin-actions">
          <button onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </header>

      <div className="main-content">
        <nav className="sidebar">
          <ul>
            <li onClick={() => setActiveView('categories')} className={activeView === 'categories' ? 'active' : ''}>
              Quản lý danh mục
            </li>
            <li onClick={() => setActiveView('products')} className={activeView === 'products' ? 'active' : ''}>
              Quản lý sản phẩm
            </li>
            <li onClick={() => setActiveView('customers')} className={activeView === 'customers' ? 'active' : ''}>
              Quản lý khách hàng
            </li>
            <li onClick={() => setActiveView('orders')} className={activeView === 'orders' ? 'active' : ''}>
              Quản lý đơn hàng
            </li>
          </ul>
        </nav>
        <div className="view-container">{renderView()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
