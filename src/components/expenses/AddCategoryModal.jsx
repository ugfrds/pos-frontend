import React, { useState } from 'react';

const AddCategoryModal = ({ isVisible, onClose, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleSave = () => {
    onAddCategory(newCategory);
  };

  if (!isVisible) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Category</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Category Name</label>
              <input type="text" className="form-control" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Add Category</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
