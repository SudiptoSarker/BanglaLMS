import styles from './notice.module.css';

const Instructions = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>「ahamo」「LINEMO」「ドコモ払い」を不利用予定またはご利用中のお客様</h1>
      
      <p className={styles.paragraph}>
        サイトで動作が不安定な場合の対処法です。...
        <br />
        (Here include any other introductory text)
      </p>
      
      {/* Repeatable instruction section */}
      <div className={styles.section}>
        <p className={styles.text}>
          ① [アカウント作成]をクリックします。
        </p>
        <img src="/images/instruction1.png" alt="Step 1" className={styles.image} />
      </div>

      <div className={styles.section}>
        <p className={styles.text}>
          ② [ログイン]をクリックします。
        </p>
        <img src="/images/instruction2.png" alt="Step 2" className={styles.image} />
      </div>

      <div className={styles.section}>
        <p className={styles.text}>
          ③ [パスワードを設定]をクリックします。
        </p>
        <img src="/images/instruction3.png" alt="Step 3" className={styles.image} />
      </div>

      {/* Add as many sections as needed */}
    </div>
  );
};

export default Instructions;
