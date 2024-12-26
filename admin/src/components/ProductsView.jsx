import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase'; // Đảm bảo đường dẫn này chính xác
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import './ProductsView.css';  // Import CSS file

const ProductsView = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id_product: '',
    name: '',
    price: '',
    sale_price: '',
    imageUrls: [''], // Lưu trữ mảng các URL hình ảnh
    mo_ta: '',
    sizes: [''], // Lưu trữ mảng các size
    stock: '',
    id_cata: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Để kiểm tra xem đang sửa sản phẩm hay thêm mới
  const [currentProductId, setCurrentProductId] = useState(null); // Lưu ID của sản phẩm đang sửa
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'products'));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        sizes: doc.data().sizes || [], // Đảm bảo luôn là mảng
        imageUrls: doc.data().imageUrls || [], // Đảm bảo luôn là mảng
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);  

  // Thêm mới sản phẩm
  const handleAddProduct = async () => {
    try {
      await addDoc(collection(firestore, 'products'), newProduct);
      setProducts([...products, newProduct]);
      resetForm();
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    try {
      const productRef = doc(firestore, 'products', currentProductId);
      await updateDoc(productRef, newProduct);
      setProducts(
        products.map((product) =>
          product.id === currentProductId ? { ...product, ...newProduct } : product
        )
      );
      resetForm();
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(firestore, 'products', id);
      await deleteDoc(productRef);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewProduct({
      id_product: '',
      name: '',
      price: '',
      sale_price: '',
      imageUrls: [],
      mo_ta: '',
      sizes: [],
      stock: '',
      id_cata: '',
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // Chỉnh sửa sản phẩm
  const handleEditProduct = (product) => {
    setNewProduct(product);
    setIsEditing(true);
    setCurrentProductId(product.id);
    setShowForm(true);
  };

  // Hủy bỏ việc chỉnh sửa
  const handleCancel = () => {
    resetForm();
  };

  // Thêm một kích thước mới
  const handleAddSize = () => {
    setNewProduct({ ...newProduct, sizes: [...newProduct.sizes, ''] });
  };

  // Xóa một kích thước
  const handleDeleteSize = (index) => {
    const newSizes = newProduct.sizes.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, sizes: newSizes });
  };

  // Thêm một URL hình ảnh mới
  const handleAddImage = () => {
    setNewProduct({ ...newProduct, imageUrls: [...newProduct.imageUrls, ''] });
  };

  // Xóa một URL hình ảnh
  const handleDeleteImage = (index) => {
    const newImages = newProduct.imageUrls.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, imageUrls: newImages });
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>
        Thêm mới
      </button>

      {showForm && (
        <div className="add-new-form">
          <h3>{isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h3>
          <input
            type="text"
            placeholder="ID sản phẩm"
            value={newProduct.id_product}
            onChange={(e) => setNewProduct({ ...newProduct, id_product: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Giá"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Giá giảm"
            value={newProduct.sale_price}
            onChange={(e) => setNewProduct({ ...newProduct, sale_price: Number(e.target.value) })}
          />
          
          {/* Hình ảnh */}
          <h4>Hình ảnh</h4>
          {newProduct.imageUrls.map((image, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`URL hình ảnh ${index + 1}`}
                value={image}
                onChange={(e) => {
                  const newImages = [...newProduct.imageUrls];
                  newImages[index] = e.target.value;
                  setNewProduct({ ...newProduct, imageUrls: newImages });
                }}
              />
              <button onClick={() => handleDeleteImage(index)}>Xóa</button>
            </div>
          ))}
          <button onClick={handleAddImage}>Thêm hình ảnh</button>

          <textarea
            placeholder="Mô tả"
            value={newProduct.mo_ta}
            onChange={(e) => setNewProduct({ ...newProduct, mo_ta: e.target.value })}
          />
          
          {/* Kích thước */}
          <h4>Kích thước</h4>
          {newProduct.sizes.map((size, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder={`Kích thước ${index + 1}`}
                value={size}
                onChange={(e) => {
                  const newSizes = [...newProduct.sizes];
                  newSizes[index] = e.target.value;
                  setNewProduct({ ...newProduct, sizes: newSizes });
                }}
              />
              <button onClick={() => handleDeleteSize(index)}>Xóa</button>
            </div>
          ))}
          <button onClick={handleAddSize}>Thêm kích thước</button>

          <input
            type="number"
            placeholder="Số lượng tồn kho"
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          />
          <input
            type="text"
            placeholder="ID danh mục"
            value={newProduct.id_cata}
            onChange={(e) => setNewProduct({ ...newProduct, id_cata: e.target.value })}
          />
          <button onClick={isEditing ? handleUpdateProduct : handleAddProduct}>
            {isEditing ? 'Cập nhật' : 'Lưu'}
          </button>
          <button onClick={handleCancel}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Giá giảm</th>
            <th>Hình ảnh</th>
            <th>Mô tả</th>
            <th>Kích thước</th>
            <th>Tồn kho</th>
            <th>Danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id_product}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.sale_price}</td>
              <td>
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  product.imageUrls.map((url, idx) => (
                    <img key={idx} src={url} alt={product.name} width="50" />
                  ))
                ) : (
                  <span>No images available</span> // Nếu không có hình ảnh, hiển thị thông báo
                )}
              </td>
              <td>{product.mo_ta.length > 30 ? product.mo_ta.substring(0, 30) + '...' : product.mo_ta}</td>
              <td>
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.join(', ') // Hiển thị các kích thước nếu có
                ) : (
                  <span>No sizes available</span> // Nếu không có kích thước, hiển thị thông báo
                )}
              </td>
              <td>{product.stock}</td>
              <td>{product.id_cata}</td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Sửa</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsView;
