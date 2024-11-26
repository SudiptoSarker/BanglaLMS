import React from "react";
import styles from './banner.module.css';

function HeaderSection() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src="/images/logo.png" alt="Logo" />
    </header>
  );
}

export default HeaderSection;