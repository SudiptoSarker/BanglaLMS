import React from "react";
import styles from './toppage.module.css';

function TopPageComponent() {
  return (
    <section className={styles.membershipContainer}>
      {/* Title for the membership page */}
      <h1>BDGuardメンバーシップページへ</h1>
      
      {/* Information on where to check license key and download the app */}
      <p className={styles.membershipInfo}>
        ライセンスキーの確認とアプリのダウンロードは、下記の「会員ページ」から行ってください。
      </p>

      {/* Button that redirects to the membership page */}
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
