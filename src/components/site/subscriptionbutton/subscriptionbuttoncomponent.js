import React from 'react';
import { useState } from 'react';
import styles from './subscriptionbutton.module.css';
import Cookies from 'js-cookie';

function SubscriptionButton({ data }) {  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');

  const toggleModal = (e) => {
    e.preventDefault(); // Prevent form submission
    setModalOpen(!isModalOpen);
  };
  const handleOptionClick = (option) => {
    setSelectedPaymentOption(option); // Set the selected option
    document.getElementById(data.formId).submit(); // Submit the form
  };
  return (  
    <>    
    <form id={data.formId} method="post" action={data.submitlink}>    
      <p>        
        {/* Button to submit the subscription */}     
        <button className={styles.button} type="button" onClick={toggleModal}>
           {/* If buttonhtml is provided, render it directly */}
          {data.buttonhtml ? (
            <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
          ) : (            
            <>
              {/* Display device info if no custom button HTML */}
              <div className={styles.deviceInfo}>                
                <p className={styles.deviceLabel}>モバイル/PC 合計</p>
                <div className={styles.deviceCount}>
                  <span className={styles.countNumber}>{data.devicecount}</span>
                  <span className={styles.countUnit}>{data.deviceunit}</span>
                </div>
              </div>
              {/* Show subscription price */}
              <p className={styles.subscriptionInfo}>月額利用登録 {data.price}円 (税込)</p> 
            </>       
          )}
        </button>
      </p>
      
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="ci" className={styles.hiddenInput} value={data.ci} />
      <input type="hidden" name="act" className={styles.hiddenInput} value={data.act} />
      <input type="hidden" name="iai_acc_create" className={styles.hiddenInput} value='0' />
      <input type="hidden" name="iai_logincat" className={styles.hiddenInput} value='0009' />
      <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
      <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
      <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />       
    </form>

    {/* Modal */}
    {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Choose Your Payment Method</h2>
            <button
              className={styles.modalButton}
              onClick={() => handleOptionClick('クレジットカード決済')}
            >
              クレジットカード決済
            </button>
            <button
              className={styles.modalButton}
              onClick={() => handleOptionClick('Option-2 Payment')}
            >
              Option-2 Payment
            </button>
            <button className={styles.closeButton} onClick={toggleModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionButton;
