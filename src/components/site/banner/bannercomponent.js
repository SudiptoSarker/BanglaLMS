import React from "react";
import styles from './banner.module.css';

/**
 * This is common banner section used by all other pages, it contains a banner with a logo and a logout button.
 */
function HeaderSection() {
  const handleLogout = (e) => {
    e.preventDefault();
    // Add your logout logic here
    console.log("Logout submitted!");
  };

  return (
    <header className={styles.header}>
      {/* Displays the site logo */}
      <img className={styles.logo} src="/images/logo.png" alt="Logo" />

      {/* Logout Button */}      

      {/* <form id="formLogout" method="post" action="https://devwww.mopita.com/cp/logout" className={styles.logoutForm}>               
          <button type="submit" className={styles.logoutButton}>Logout</button>

          <input type="hidden" name="nl" className={styles.hiddenInput} value="https://stgbanglalms.mopita.com/top" />      
          <input type="hidden" name="cl" className={styles.hiddenInput} value="https://stgbanglalms.mopita.com/unsubscribe" />                    
      </form> */}
      
    </header>
  );
}

export default HeaderSection;
