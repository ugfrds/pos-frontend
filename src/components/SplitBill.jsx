
import { useState, useEffect , useContext} from "react";
import { Button } from "react-bootstrap";
import { createRoot } from 'react-dom/client';
import { UserBusinessContext } from '../context/UserBusinessContext';
import { ReceiptContent } from "./ReceiptContent";

const SplitBill = ({ selectedOrder, handleSplitPayment, currency, receiptRef,handlePrintReceipt }) => {
  const [splitType, setSplitType] = useState("equal"); // "equal" or "custom"
  const [numPersons, setNumPersons] = useState(1); // Default to 1
  const [customSplits, setCustomSplits] = useState([]);
  const [remainingAmount, setRemainingAmount] = useState(selectedOrder.totalAmount);
  const { business } = useContext(UserBusinessContext); 
const businessName = business.settings.name
const receiptNotes = business.settings.receiptNotes;
const contact = business.settings.phoneNumber;

  // Update remaining amount dynamically
  useEffect(() => {
    const totalAllocated = customSplits.reduce((sum, split) => sum + (split.amount || 0), 0);
    setRemainingAmount(selectedOrder.totalAmount - totalAllocated);
  }, [customSplits, selectedOrder.totalAmount]);

  const incrementPersons = () => {
    setNumPersons((prev) => {
      const updatedValue = prev + 1;
      updateCustomSplits(updatedValue);
      return updatedValue;
    });
  };

  const decrementPersons = () => {
    setNumPersons((prev) => {
      const updatedValue = Math.max(0, prev - 1);
      updateCustomSplits(updatedValue);
      return updatedValue;
    });
  };

  const handleNumPersonsChange = (value) => {
    const validValue = Math.max(0, parseInt(value) || 0);
    setNumPersons(validValue);
    updateCustomSplits(validValue);
  };

  const updateCustomSplits = (persons) => {
    setCustomSplits(
      Array.from({ length: persons }, (_, index) => customSplits[index] || { amount: 0, method: null })
    );
  };

  const handleCustomSplitChange = (index, amount) => {
    const updatedSplits = [...customSplits];
    updatedSplits[index].amount = parseFloat(amount) || 0;
    setCustomSplits(updatedSplits);
  };

const handleGenerateSplitReceipt = () => {
  if (!selectedOrder || !customSplits || customSplits.length === 0) {
    alert("No split details available to generate a receipt.");
    return;
  }

  // Prepare receipt data
  const receiptData = {
    businessName,
    contact,
    receiptNotes,
    currency,
    selectedOrder,
    splits: customSplits.map((split, index) => ({
      person: `Person ${index + 1}`,
      amount: split.amount,
      method: split.method || "N/A",
    })),
  };

  // Dynamically render the receipt content
  
  let receiptContainer = document.getElementById("receipt-print");
if (!receiptContainer) {
  receiptContainer = document.createElement("div");
  receiptContainer.id = "receipt-print";
  receiptContainer.style.display = "none";
  document.body.appendChild(receiptContainer);
}

  if (receiptContainer) {
    const root = createRoot(receiptContainer);
    root.render(
      <ReceiptContent
        ref={receiptRef}
        businessName={receiptData.businessName}
        contact={receiptData.contact}
        receiptNotes={receiptData.receiptNotes}
        currency={receiptData.currency}
        selectedOrder={receiptData.selectedOrder}
        splits={receiptData.splits}
      />
    );
    handlePrintReceipt();
    alert("Split receipt data ready! Check print section.");
  } else {
    console.error("Receipt container not found.");
  }
};

  const equalSplitAmount = numPersons > 0 ? (selectedOrder.totalAmount / numPersons).toFixed(2) : 0;

  return (
    <div>
      <div className="split-options mb-3">
        <label>
          Split Type:
          <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
            <option value="equal">Equal Split</option>
            <option value="custom">Custom Split</option>
          </select>
        </label>
      </div>

      <div className="number-of-persons mb-3 d-flex align-items-center">
        <button className="btn btn-outline-secondary" onClick={decrementPersons}>
          -
        </button>
        <input
          type="number"
          className="form-control mx-2 text-center"
          style={{ maxWidth: "80px" }}
          value={numPersons}
          onChange={(e) => handleNumPersonsChange(e.target.value)}
        />
        <button className="btn btn-outline-secondary" onClick={incrementPersons}>
          +
        </button>
      </div>

      {splitType === "equal" && (
        <div>
          <h5>Equal Split</h5>
          <p>
            Each person pays: {currency} {equalSplitAmount}
          </p>
        </div>
      )}

      {splitType === "custom" && (
        <div>
          <h5>Custom Split</h5>
          <p style={{ color: remainingAmount < 0 ? "red" : "black" }}>
            Remaining Amount: {currency} {remainingAmount.toFixed(2)}
          </p>
          {Array.from({ length: numPersons }).map((_, index) => (
            <div key={index} className="custom-split-entry mb-2 d-flex align-items-center">
              <span>Person {index + 1}:</span>
              <input
                type="number"
                className="form-control mx-2"
                value={customSplits[index]?.amount || ""}
                onChange={(e) => handleCustomSplitChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-between mt-3">
        <Button
          className="btn btn-primary"
          onClick={() => handleSplitPayment(splitType, numPersons, splitType === "custom" ? customSplits : null)}
          disabled={remainingAmount !== 0}
        >
          Confirm Split
        </Button>
        <Button
          className="btn btn-info"
          onClick={handleGenerateSplitReceipt}
          disabled={remainingAmount !== 0}
        >
          Generate Receipt
        </Button>
      </div>
    </div>
  );
};

export default SplitBill;

  