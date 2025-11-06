import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FormatCurrency } from "../../../utils";

const ExpensesTable = ({ expenses, onEdit, onDelete, currency }) => {
  return (
    <div className="table-container mt-3">
      <Table striped hover responsive className="shadow-sm align-middle">
        <thead className="table-dark text-uppercase small">
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="text-end">Amount</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center text-muted py-4">
                No expense records found.
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.description}</td>
                <td>{expense.category}</td>
                <td className="text-end">
                  {FormatCurrency(expense.amount, currency)}
                </td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(expense)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpensesTable;
