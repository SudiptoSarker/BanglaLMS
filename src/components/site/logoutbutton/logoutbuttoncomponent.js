import React from "react";
import styles from './logoutbutton.module.css';

function LogoutButton({  }) {
  
  return (    
    <form id="formLogout" method="post" action="https://devwww.mopita.com/cp/logout" className={styles.logoutForm} >
        <button type="submit" className={styles.logoutButton}>
          Logout
        </button>

        <input type="hidden" name="nl" className={styles.hiddenInput} value="https://stgbanglalms.mopita.com" />
        <input type="hidden" name="cl" className={styles.hiddenInput} value="https://stgbanglalms.mopita.com/top" />
    </form>
  );
}

export default LogoutButton;
