import React from 'react';
import styles from './notification.module.css';

const NotificationComponent = ({ text, href }) => {
  return (
    <section className={styles.section}>      
      <a href={href} className={styles.notice} role="alert">
        {/* 「ahamo」「LINEMO」「ドコモ払い」をご利用予定またはご利用中の皆様へのお知らせ */}
        {text}
      </a> 
    </section>
  );
};

export default NotificationComponent;