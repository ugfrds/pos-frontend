import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FormatCurrency } from "../../../utils";

const ExpensesTable = ({ expenses, onEdit, onDelete, currency }) => {
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
            <td>{FormatCurrency(expense.amount, currency)}</td>
            <td>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(expense)} className="me-2">
                <FaEdit />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(expense.id)}>
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