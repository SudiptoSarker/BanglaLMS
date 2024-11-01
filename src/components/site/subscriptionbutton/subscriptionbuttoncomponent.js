import React from 'react';
import styles from './subscriptionbutton.module.css';
import Cookies from 'js-cookie';

function SubscriptionButton({ data }) {
  const handleSubscription = () => {
    console.log('Subscription button clicked');
  };
  
  return (  
    <form id={data.formId} method="post" action={data.submitlink}>
      <p>        
        <button className={styles.button} type="submit" onClick={handleSubscription}>
          {data.buttonhtml ? (
            <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
          ) : (            
            <>
              <div className={styles.deviceInfo}>                
                <p className={styles.deviceLabel}>モバイル/PC 合計</p>
                <div className={styles.deviceCount}>
                  <span className={styles.countNumber}>{data.devicecount}</span>
                  <span className={styles.countUnit}>{data.deviceunit}</span>
                </div>
              </div>
              <p className={styles.subscriptionInfo}>月額利用登録 {data.price}円 (税込)</p> 
            </>       
          )}
        </button>
      </p>
      <input type="hidden" name="ci" className={styles.hiddenInput} value={data.ci} />
      <input type="hidden" name="act" className={styles.hiddenInput} value={data.act} />
      <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
      <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
      <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />
    </form>
  );
};

export default SubscriptionButton;
