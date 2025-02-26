import React from "react";
import styles from './loginbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';

/**
 * The LoginButton component renders a login form for users who are not already authenticated. 
 */
function LoginButton({ data }) {  
  // State to store the cookie data, initially null
  const [cookieData,setCookieData] = useState(null);

  // useEffect to check for the existence of the 'iai_mtisess_secure' cookie on component mount
  useEffect(()=>{
      let cookieValue = Cookies.get('iai_mtisess_secure');
      if(cookieValue!=null || cookieValue !='' || cookieValue!=undefined){
        setCookieData(cookieValue);
      }
  },[]);

  console.log('data: ',data?.submitlink);
  return (    
    <section>      
      {(typeof data?.formid === "string" && data.formid.trim() && 
        typeof data?.submitlink === "string" && data.submitlink.trim() && data.submitlink !== "null" && 
        typeof data?.nl === "string" && data.nl.trim() && data.nl !== "null") ? (
        <form id={data.formid} method="post" action={data.submitlink}>
          <p>                      
            <button className={styles.loginForm} type="submit">              
              {data.buttonhtml ? (
                <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
              ) : (            
                <>              
                  <p>Login</p> 
                </>       
              )}
            </button>
          </p>
          {/* Hidden input field to include additional form data */}
          <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />                
        </form>
      ) : null}
    </section>

  );
}

export default LoginButton;
