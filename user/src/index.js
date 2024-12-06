import React from 'react';
import ReactDOM from 'react-dom/client';  // Chú ý: Sử dụng `react-dom/client` thay vì `react-dom`
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Sử dụng `createRoot` thay cho `render`
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);