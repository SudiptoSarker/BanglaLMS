import React from 'react';
import styles from './announce.module.css';

// Announce Component to display a clickable announcement link
const AnnounceComponent = (announcement) => {
  return (
    <section className={styles.section}> 
      {/* Link for the announcement */}
      <a href={announcement.link} className={styles.link}>      
        {announcement.text}
      </a>
    </section>
  );
};

export default AnnounceComponent;