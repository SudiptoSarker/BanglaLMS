import React from 'react';
import styles from './information.module.css';

const InformationSection = ({ noticeLink, maintenanceLink }) => {
  return (
    <section className={styles.section}>
      <p className={styles.info}>
        BDBuard は、デジタルライフをより簡単で安全にし、オンライン使用時にクレジットカード情報を保護してくれる、安全なクロスプラットフォームのパスワード マネージャーです。ハッカーが盗聴する可能性のある安全でない Web ブラウザーにパスワードやクレジットカード番号を入力して保存する必要はもうありません。
      </p>
      <a href={noticeLink} className={styles.notice} role="alert">
        「ahamo」「LINEMO」「ドコモ払い」をご利用予定またはご利用中の皆様へのお知らせ
      </a>
      <a href={maintenanceLink} className={styles.link}>
        システムメンテナンスのお知らせ
      </a>
    </section>
  );
};

export default InformationSection;