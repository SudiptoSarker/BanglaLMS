import React from 'react';
import styles from './unsubscribe.module.css';
import FeatureList from './unsubscribefeaturelist';

function UnsubscribeComponent() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>解約前のご注意</h1>
      <p className={styles.warning}>
        キャンセル後は、BDGuard の機能が一切使用できなくなりますのでご注意ください。
      </p>
      <section className={styles.featureSection}>
        <h2 className={styles.featureTitle}>BDGuardの主な機能</h2>
        <FeatureList />
        <h2 className={styles.cancellationTitle}>解約</h2>
        <p className={styles.thankYouMessage}>
          BDGuardをご利用いただきありがとうございます。
        </p>
        <p className={styles.cancellationInstructions}>
          解約を行う場合は、以下の「解約する」ボタンからお進みください。
        </p>
        <p className={styles.farewell}>
          これまでのご愛顧、誠にありがとうございました。
        </p>
        <button className={styles.backButton}>戻る</button>
        <button className={styles.cancelButton}>解約する</button>
      </section>
    </main>
  );
}

export default UnsubscribeComponent;