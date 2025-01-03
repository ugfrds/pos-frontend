import { FormatCurrency } from '../utils/index';
import React from 'react';
import PropTypes from 'prop-types';
import Barcode from 'react-barcode';
import './Orders/ReceiptModal.css';

export const ReceiptContent = React.forwardRef(
  ({ businessName, selectedOrder, currency, receiptNotes, contact, location, splits }, ref) => (
    <div ref={ref} id="receipt" className="receipt-modal-details">
      <div className="receipt-header text-center">
        <h3 className="receipt-title">Cash Receipt</h3> {/* Receipt header */}
        <h2 className="business-name">{businessName}</h2>
        <p>{location}</p>
        <p>Phone: {contact}</p>
        <p>Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
        <p>Time: {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
        <p><strong>Receipt Number:</strong> {selectedOrder.receiptNumber}</p>
      </div>
      <ul className="receipt-items list-unstyled">
  <table className="receipt-table">
    <thead>
      <tr>
        <th className="item-name-header">Item</th>
        <th className="quantity-header">Qty</th>
        <th className="item-total-header">Price</th>
      </tr>
    </thead>
    <tbody>
      {selectedOrder.OrderItems.map((item, index) => (
        <tr key={index} className="receipt-item">
          <td className="item-name">{item.MenuItem.name}</td>
          <td className="quantity">{item.quantity}</td>
          <td className="item-total">{FormatCurrency(item.price, currency)}</td>
        </tr>
      ))}
    </tbody>
  </table>
</ul>

      <div className="receipt-footer">
        <div className="item-details">
          <span className="item-name"><strong>Subtotal:</strong></span>
          <span className="item-total">{FormatCurrency(selectedOrder.subtotal, currency)}</span>
        </div>
        <div className="item-details">
          <span className="item-name"><strong>Tax:</strong></span>
          <span className="item-total">{FormatCurrency(selectedOrder.tax, currency)}</span>
        </div>
        <div className="item-details">
          <span className="item-name"><strong>Service Charge:</strong></span>
          <span className="item-total">{FormatCurrency(selectedOrder.serviceCharge, currency)}</span>
        </div>
        <div className="item-details">
          <span className="item-name"><strong>Total:</strong></span>
          <span className="item-total"><strong>{FormatCurrency(selectedOrder.totalAmount, currency)}</strong></span>
        </div>
      </div>
      <p className="served-by"><strong>Served By:</strong> {selectedOrder.username}</p>
      {receiptNotes && <p className="receipt-notes">{receiptNotes}</p>}
      {splits && splits.length > 0 && (
        <div className="split-receipt-details">
          <h5 className="text-center">Split Payment Details</h5>
          <ul className="list-unstyled">
            {splits.map((split, index) => (
              <li key={index} className="split-item">
                <div className="item-details">
                  <span className="item-name"><strong>{split.person}</strong></span>
                  <span className="item-total">{FormatCurrency(split.amount, currency)}</span>
                  <span className="payment-method">({split.method})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="barcode-container">
        <Barcode
          value={selectedOrder.receiptNumber}
          format="CODE128"
          width={2}
          height={50}
          displayValue={false}
        />
      </div>
    </div>
  )
);

ReceiptContent.displayName = 'ReceiptContent';



// PropTypes validation
ReceiptContent.propTypes = {
    business: PropTypes.shape({
      
     // phone: PropTypes.string.isRequired,
      settings: PropTypes.shape({
        businessName: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
      }).isRequired,
    }),
    selectedOrder: PropTypes.shape({
      createdAt: PropTypes.string.isRequired,
      receiptNumber: PropTypes.string.isRequired,
      tableNumber: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      subtotal: PropTypes.number.isRequired,
      tax: PropTypes.number,
      serviceCharge: PropTypes.number,
      totalAmount: PropTypes.number.isRequired,
      OrderItems: PropTypes.arrayOf(
        PropTypes.shape({
          MenuItem: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
          quantity: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
    currency: PropTypes.string.isRequired,
    contact: PropTypes.string,
    receiptNotes: PropTypes.string
  };
  

  
  
  
  