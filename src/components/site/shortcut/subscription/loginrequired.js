import { useState } from "react";
import styles from "./loginrequired.module.css";

export default function LoginRequired({ isOpen, onClose }) {
  if (!isOpen) return null;


  // Close the modal when clicked outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.loginRequiredOverlay} onClick={handleOverlayClick}>
      <div className={styles.loginRequiredContent}>
        <h2>Login Required!</h2>
        <p className={styles.modalMessage}>
            Please login first to purchase the subscription.
        </p>
        <div className={styles.buttonContainer}>
          <button className={styles.closeLoginRequiredButton} onClick={onClose}>
            Close
          </button>          
        </div>
      </div>
    </div>
  );
}
