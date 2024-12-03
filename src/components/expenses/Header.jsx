import React from 'react';

const Header = ({ onAddExpenditure }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1>Expenditures</h1>
      <button className="btn btn-primary" onClick={onAddExpenditure}>Add Expenditure</button>
    </div>
  );
};

export default Header;
