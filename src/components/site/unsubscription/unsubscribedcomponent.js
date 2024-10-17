import React from "react";
import styles from './unsubscribed.module.css';

function UnsubscribedComponent() {
  return (
    <main className={styles.container}>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/927b0a6cddee714b33bc39830585f00d959038e0f15f59defebb2ca71ed0df06?placeholderIfAbsent=true&apiKey=6d2fa06cce744f22a1e3f36901f6ddf3" 
        alt="BDGuard cancellation confirmation" 
        className={styles.confirmationImage}
      />
      <section className={styles.contentWrapper}>
        <h1 className={styles.title}>BDGuardの解約手続きが完了しました。</h1>
        <p className={styles.thankYouMessage}>
          ご利用いただき、ありがとうございました。
        </p>
        <button className={styles.returnButton} type="button" onclick="location.href='/'">TOPへ戻る</button>
      </section>
    </main>
  );
}

export default UnsubscribedComponent;
