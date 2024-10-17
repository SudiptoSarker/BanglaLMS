import React from "react";
import styles from './toppage.module.css';

function TopPageComponent() {
  return (
    <section className={styles.membershipContainer}>
      <h1>BDGuardメンバーシップページへ</h1>
      <p className={styles.membershipInfo}>
        ライセンスキーの確認とアプリのダウンロードは、下記の「会員ページ」から行ってください。
      </p>
      <button 
        className={`${styles.membershipLink} btn`} 
        type="button" 
        onClick={() => location.href='/member'}
      >
        BDGuardメンバーシップページへ
      </button>
    </section>
  );
}

export default TopPageComponent;
