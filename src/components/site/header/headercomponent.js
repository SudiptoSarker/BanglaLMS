import React from 'react';
import styles from './header.module.css';

const HeaderComponent = () => {
  return (
    <section className={styles.section}>
      <p className={styles.info}>
        BDBuard は、デジタルライフをより簡単で安全にし、オンライン使用時にクレジットカード情報を保護してくれる、安全なクロスプラットフォームのパスワード マネージャーです。ハッカーが盗聴する可能性のある安全でない Web ブラウザーにパスワードやクレジットカード番号を入力して保存する必要はもうありません。
      </p>      
    </section>
  );
};

export default HeaderComponent;