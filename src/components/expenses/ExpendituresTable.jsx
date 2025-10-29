import React from 'react';
import ExpenditureRow from './ExpenditureRow';

const ExpendituresTable = ({ expenditures, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Vendor</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenditures.map((expenditure, index) => (
            <ExpenditureRow key={index} expenditure={expenditure} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpendituresTable;
