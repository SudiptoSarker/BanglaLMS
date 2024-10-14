import React from 'react';
import styles from './servicecard.module.css';

const ServiceCard = ({ iconSrc, title, description }) => {
  return (
    <div className={styles.serviceCard}>
      <img loading="lazy" src={iconSrc} alt={`${title} icon`} className={styles.serviceIcon} />
      <h3 className={styles.serviceTitle}>{title}</h3>
      <p className={styles.serviceDescription}>{description}</p>
    </div>
  );
};

export default ServiceCard;