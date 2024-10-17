import React from 'react';
import styles from './announce.module.css';

const AnnounceComponent = (announcement) => {
  return (
    <section className={styles.section}> 
      <a href={announcement.link} className={styles.link}>
        {/* システムメンテナンスのお知らせ */}
        {announcement.text}
      </a>
    </section>
  );
};

export default AnnounceComponent;