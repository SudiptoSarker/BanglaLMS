import React from "react";
import styles from './banner.module.css';

/**
 * This is common banner section used by all other pages, it contains a banner with a logo.
 */
function HeaderSection() {
  return (
    <header className={styles.header}>
          <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/134b0e5f6034495bbc0815b87c9d9d13/3d8386611e8b4b68e18ddc967c4c35cc369dc17c31571bd86159c9d6d3f2388b?apiKey=134b0e5f6034495bbc0815b87c9d9d13&"
          className={styles.backgroundImage}
          alt=""
          />
          <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/134b0e5f6034495bbc0815b87c9d9d13/2e5e79aa909de7113238d4709088b3f1983aeebc5ec81023547683840e9b7b44?apiKey=134b0e5f6034495bbc0815b87c9d9d13&"
          className={styles.logo}
          alt="Company Logo"
          />
      </header>
  );
}

export default HeaderSection;