import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const ExpensesTable = ({ expenses, onEdit, onDelete }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td>{expense.date}</td>
            <td>{expense.description}</td>
            <td>{expense.category}</td>
            <td>${expense.amount}</td>
            <td>
              <Button variant="light" onClick={() => onEdit(expense)} className="me-2">
                <FaEdit />
              </Button>
              <Button variant="light" color="danger" onClick={() => onDelete(expense.id)}>
                <FaTrash />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ExpensesTable;