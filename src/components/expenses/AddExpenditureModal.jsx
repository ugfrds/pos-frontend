import React, { useState } from 'react';

const AddExpenditureModal = ({ isVisible, onClose, onSave, categories, vendors }) => {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    vendor: '',
    description: '',
    amount: 0,
    paymentMethod: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isVisible) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Expenditure</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" className="form-control" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="form-control" onChange={handleInputChange}>
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Vendor</label>
              <select name="vendor" className="form-control" onChange={handleInputChange}>
                <option value="">Select Vendor</option>
                {vendors.map((vendor, index) => (
                  <option key={index} value={vendor}>{vendor}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input type="text" name="description" className="form-control" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" className="form-control" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <input type="text" name="paymentMethod" className="form-control" onChange={handleInputChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenditureModal;
