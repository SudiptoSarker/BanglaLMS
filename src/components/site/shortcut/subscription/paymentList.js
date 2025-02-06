import { useState } from "react";
import styles from "./paymentList.module.css";

export default function PaymentList({ isOpen, onClose, onSelectPayment }) {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const paymentMethods = [
    { id: "credit_card", name: "Credit Card" },
    { id: "paypal", name: "PayPal" },
    { id: "bank_transfer", name: "Bank Transfer" }
  ];

  // Close the modal when clicked outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.paymentModalOverlay} onClick={handleOverlayClick}>
      <div className={styles.paymentModalContent}>
        <h2>Select Payment Method</h2>
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            className={`${styles.paymentOption} ${
              selectedMethod === method.id ? styles.selectedPayment : ""
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            {method.name}
          </button>
        ))}
        <div className={styles.buttonContainer}>
          <button className={styles.closePaymentButton} onClick={onClose}>
            Close
          </button>
          <button
            className={styles.confirmButton}
            onClick={() => onSelectPayment(selectedMethod)}
            disabled={!selectedMethod}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
