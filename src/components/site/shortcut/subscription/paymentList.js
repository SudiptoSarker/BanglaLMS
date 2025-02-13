import { useState } from "react";
import styles from "./paymentList.module.css";

export default function PaymentList({ isOpen, onClose, paymentMethods = [], formId, ci,siteMode }) {
  if (!isOpen) return null;

  const [selectedMethod, setSelectedMethod] = useState(null);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    if (selectedMethod) {     
      const selectedPayment = paymentMethods.find(method => method.paytype_info.paytype === selectedMethod);      
      const serviceID = ci;
      const payType = selectedMethod;

      const beforePayResponse = await fetch(`/api/mopita/beforepay?siteMode=${siteMode}&service=${serviceID}&type=${payType}&action=reg`)
      const jsonData = await beforePayResponse.json();
      let responseCode = jsonData.result.result.code;
  
      if (responseCode === "I000") {
        const formElement = document.getElementById(formId);
        if (formElement && selectedPayment?.paytype_info.payment_link) {
          formElement.action = selectedPayment.paytype_info.payment_link; // Set the new action URL
          formElement.submit();
        } else {
          console.error("Form element or payment link is missing.");
        }
      } else {
        console.log(jsonData.result.result.args);        
      }      
    }
  };
  
  return (
    <div className={styles.paymentModalOverlay} onClick={handleOverlayClick}>
      <div className={styles.paymentModalContent}>
        <h2>Select Payment Method</h2>
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method, index) => (
            <button
              key={index}
              className={`${styles.paymentOption} ${
                selectedMethod === method.paytype_info.paytype ? styles.selectedPayment : ""
              }`}
              onClick={() => setSelectedMethod(method.paytype_info.paytype)}
            >
              {method.paytype_info.paytype_name}
            </button>
          ))
        ) : (
          <p>No payment methods available.</p>
        )}
        <div className={styles.buttonContainer}>
          <button className={styles.closePaymentButton} onClick={onClose}>
            Close
          </button>
          <button
            className={styles.confirmButton}
            onClick={handleConfirm}
            disabled={!selectedMethod}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
