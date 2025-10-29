import React from 'react';

const ExpenditureRow = ({ expenditure, onEdit, onDelete }) => {
  return (
    <tr>
      <td>{expenditure.date}</td>
      <td>{expenditure.category}</td>
      <td>{expenditure.vendor}</td>
      <td>{expenditure.description}</td>
      <td>${expenditure.amount.toFixed(2)}</td>
      <td>{expenditure.paymentMethod}</td>
      <td>
        <button className="btn btn-sm btn-warning" onClick={() => onEdit(expenditure.id)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(expenditure.id)}>Delete</button>
      </td>
    </tr>
  );
};

export default ExpenditureRow;
