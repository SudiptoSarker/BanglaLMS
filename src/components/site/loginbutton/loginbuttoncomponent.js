import React from "react";
import styles from './loginbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';

function LoginButton() {
  const [cookieData,setCookieData] = useState(null);

  useEffect(()=>{
      let cookieValue = Cookies.get('iai_mtisess_secure');
      if(cookieValue!=null || cookieValue !='' || cookieValue!=undefined){
        setCookieData(cookieValue);
      }
  },[]);

  const handleLogin = () => {
    console.log('Login button clicked');
  };
  return (    
    <section>
      {cookieData==null &&
        <button className={styles.loginForm} type="submit" onClick={handleLogin}>
          <h1>mopitaにログイン</h1>
        </button>
      }
    </section>
  );
}

export default LoginButton;
