import React from "react";
import styles from './toppage.module.css';

function TopPageComponent({ci}) {
  return (
    <section className={styles.membershipContainer}>
       {/* Title for the membership page */}
      
      {/* Button that redirects to the membership page */}
      <button 
        className={`${styles.membershipLink} btn`} 
        type="button" 
        onClick={() => location.href='/member?ci='+ci}
      >
        BDGuardメンバーシップページへ
      </button>
    </section>
  );
}

export default TopPageComponent;
