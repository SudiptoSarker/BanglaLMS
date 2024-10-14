import React from 'react';
import styles from './memberpage.module.css';

function MemberPageComponent() {
  return (
    <section className={styles.container}>
      <p className={styles.instruction}>
        BDGuardを購入するか、mopitaにログインしてください
      </p>
      <h1 className={styles.title}>BDGuard License Key</h1>
      <p className={styles.licenseKey} tabIndex="0" aria-label="Your BDGuard License Key">
        SudiptoSarker1122334455667788
      </p>
    </section>
  );
}

export default MemberPageComponent;