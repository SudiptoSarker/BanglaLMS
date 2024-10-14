import React from "react";
import styles from './banner.module.css';

function HeaderSection() {
  return (
    <header className={styles.headerSection}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/fbc38431ac018da55051afdb4fdac93a0b6c7a9e0a7b33d44fd70f701bbe5878?placeholderIfAbsent=true&apiKey=6d2fa06cce744f22a1e3f36901f6ddf3"
        className={styles.headerImage}
        alt="Header visual"
      />
    </header>
  );
}

export default HeaderSection;