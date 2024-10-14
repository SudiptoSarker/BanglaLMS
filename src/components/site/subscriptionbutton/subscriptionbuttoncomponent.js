import React from 'react';
import styles from './subscriptionbutton.module.css';

const SubscriptionButton = () => {
  return (
    <button className={styles.button}>
      月額利用登録（入会）　月額275円（税込）
    </button>
  );
};

export default SubscriptionButton;