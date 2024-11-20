import React from 'react';
import styles from './servicecard.module.css';


/**
 * ServiceCard Component
 * This component is designed to display a card-like UI element that represents a specific service or feature.
 */
const ServiceCard = ({ iconSrc, title, description }) => {
  return (
    <div className={styles.serviceCard}>      
      {/* Icon/Image*/}
      <img loading="lazy" src={iconSrc} alt={`${title} icon`} className={styles.serviceIcon} />

      {/* Title: The title of the service */}
      <h3 className={styles.serviceTitle}>{title}</h3>

      {/* Description: A short description of the service */}
      <p className={styles.serviceDescription}>{description}</p>
    </div>
  );
};

export default ServiceCard;