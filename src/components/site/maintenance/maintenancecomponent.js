import styles from './maintenance.module.css';

const Maintenance = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>システムメンテナンスのお知らせ</h1>
      <p className={styles.paragraph}>
        平素よりAdGuardをご愛顧いただき誠にありがとうございます。<br />
        下記日程にてシステムメンテナンスを行うため、サイトへのアクセスを停止させていただきます。<br />
        お客様には大変ご不便をおかけいたしますが、なにとぞご理解を賜りますよう、よろしくお願い申し上げます。
      </p>
      <h2 className={styles.subtitle}>システムメンテナンス日時</h2>
      <ul className={styles.list}>
        <li>8/13 (火) 22:00 〜 25:00頃まで</li>
      </ul>
      <p className={styles.note}>※作業状況により、時間が多少前後する場合がございます。</p>
      <p className={styles.paragraph}>
        本サイトをご利用のお客様は、該当の時間帯をさけてのご利用をお願いいたします。<br />
        尚、既にアプリをご利用いただいている場合、アプリの利用に影響はございません。<br />
        ご利用のお客様にはご注意をおかけ致しますが、今後ともご愛顧賜りますようお願い申し上げます。
      </p>
    </div>
  );
};

export default Maintenance;
