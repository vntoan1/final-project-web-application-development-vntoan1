import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import CategoriesView from '../components/CategoriesView';
import ProductsView from '../components/ProductsView';
import CustomersView from '../components/CustomersView';
import OrdersView from '../components/OrdersView';
import BannersView from '../components/BannersView'; // Import BannersView
import './AdminDashboard.css';
import logo from '../images/logo.png';

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('categories');
  const navigate = useNavigate();

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
      case 'banners': // Case for banners
        return <BannersView />;
      default:
        return <h2>Chọn mục để quản lý</h2>;
    }
  };

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  return (
    <div className="admin-dashboard">
      <header className="header">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
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
            <li onClick={() => setActiveView('banners')} className={activeView === 'banners' ? 'active' : ''}>
              Quản lý banner
            </li>
          </ul>
        </nav>
        <div className="view-container">{renderView()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
