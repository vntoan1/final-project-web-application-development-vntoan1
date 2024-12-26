import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import './CategoriesView.css';

const CategoriesView = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ id_cata: '', name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'categories'));
      const categoryList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(categoryList);
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const docRef = await addDoc(collection(firestore, 'categories'), newCategory);
      setCategories([...categories, { id: docRef.id, ...newCategory }]);
      resetNewCategory();
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  const handleDeleteCategory = async (id_cata) => {
    try {
      await deleteDoc(doc(firestore, 'categories', id_cata));
      setCategories(categories.filter((category) => category.id !== id_cata));
    } catch (error) {
      console.error('Error deleting category: ', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    try {
      await updateDoc(doc(firestore, 'categories', editingCategory.id), editingCategory);
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)));
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category: ', error);
    }
  };

  const resetNewCategory = () => {
    setShowForm(false);
    setNewCategory({ id_cata: '', name: '', description: '' });
  };

  return (
    <div>
      <button id="add-category-btn" onClick={() => {
  console.log('showForm:', showForm); // Kiểm tra khi nút được nhấn
  setShowForm(true);
}}>
  Thêm mới
</button>


      {showForm && (
        <div className="add-new-form">
          <h3>Thêm danh mục</h3>
          <input
            id="new-category-id"
            name="id_cata"
            type="text"
            placeholder="ID danh mục"
            autoComplete="off"
            value={newCategory.id_cata}
            onChange={(e) => setNewCategory({ ...newCategory, id_cata: e.target.value })}
          />
          <input
            id="new-category-name"
            name="name"
            type="text"
            placeholder="Tên danh mục"
            autoComplete="off"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <input
            id="new-category-description"
            name="description"
            type="text"
            placeholder="Mô tả"
            autoComplete="off"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <button onClick={handleAddCategory}>Lưu</button>
          <button onClick={resetNewCategory}>Hủy</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id_cata}</td>
              <td>{category.name}</td>
              <td>{category.description.length > 30 ? `${category.description.slice(0, 30)}...` : category.description}</td>
              <td>
                <button onClick={() => handleEditCategory(category)}>Sửa</button>
                <button onClick={() => handleDeleteCategory(category.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingCategory && (
        <div className="edit-form">
          <h3>Chỉnh sửa danh mục</h3>
          <input
            type="text"
            placeholder="ID danh mục"
            value={editingCategory.id_cata}
            onChange={(e) => setEditingCategory({ ...editingCategory, id_cata: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tên danh mục"
            value={editingCategory.name}
            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Mô tả"
            value={editingCategory.description}
            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
          />
          <button onClick={handleUpdateCategory}>Cập nhật</button>
          <button onClick={() => setEditingCategory(null)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default CategoriesView;
