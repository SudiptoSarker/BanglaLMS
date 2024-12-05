import React from 'react';
import styles from './notification.module.css';

 {/* notification component*/}
 export const NotificationComponent = ({ text, href }) => {
  return (
    // <section className={styles.section}>      
    <div className={styles.notification}>
      {/* Link for the notification */}
      <a href={href} className={styles.notice} role="alert">        
        {text}
      </a> 
    {/* </section> */}
    </div>
  );
};

export default NotificationComponent;