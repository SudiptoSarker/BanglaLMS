import React from 'react';
import styles from './memberpage.module.css';

function MemberPageComponent({ licenseKey }) {
  return (
    <section className={styles.container}>
      {/* Instruction to purchase the service or log into the Mopita */}
      <p className={styles.instruction}>
        BDGuardを購入するか、mopitaにログインしてください
      </p>
      <div className={styles.licenseContainer}>
        {/* Title for the license key section */}
        <h1 className={styles.title}>BDGuard License Key</h1>
        {/* Display the user's License Key */}
        <p className={styles.licenseKey} tabIndex="0" aria-label="Your BDGuard License Key">
          {licenseKey}
        </p>
      </div>
    </section>
  );
}

export default MemberPageComponent;
