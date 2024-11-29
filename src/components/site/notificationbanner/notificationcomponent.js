import React from 'react';
import styles from './notification.module.css';

 {/* notification component*/}
const NotificationComponent = ({ text, href }) => {
  return (
    <section className={styles.section}>      
      {/* Link for the notification */}
      <a href={href} className={styles.notice} role="alert">        
        {text}
      </a> 
    </section>
  );
};

export default NotificationComponent;