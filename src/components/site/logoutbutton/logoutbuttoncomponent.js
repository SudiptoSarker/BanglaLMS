import React from "react";
import styles from './logoutbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';
import { Content } from "@builder.io/react";


/**
 * The LoginButton component renders a login form for users who are not already authenticated.
 * It checks for a specific cookie (`iai_mtisess_secure`) to determine the user's login state.
 * If the cookie is not present, the login button is displayed, allowing users to log in.
 */
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
