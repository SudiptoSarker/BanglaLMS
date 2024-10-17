import React from "react";
import styles from './loginbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';

function LoginButton({ data }) {
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
        <>
          <form id={data.formId} method="post" action={data.submitlink}>
            <p>        
              <button className={styles.loginForm} type="submit" onClick={handleLogin}>
                {data.buttonhtml ? (
                  <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
                ) : (            
                  <>              
                    <p>mopitaにログイン</p> 
                  </>       
                )}
              </button>
            </p>
            <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />      
          </form>
        </>
      }
    </section>
  );
}

export default LoginButton;
