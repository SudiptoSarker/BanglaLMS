import React from "react";
import styles from './banner.module.css';

/**
 * This is common banner section used by all other pages, it contains a banner with a logo.
 */
function HeaderSection() {
  return (
    <header className={styles.header}>
      {/* Displays the site logo */}
      <img className={styles.logo} src="/images/logo.png" alt="Logo" />
    </header>
  );
}

export default HeaderSection;