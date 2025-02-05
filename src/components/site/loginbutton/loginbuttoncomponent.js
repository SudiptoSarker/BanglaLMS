import React from "react";
import styles from './loginbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';
import { Content } from "@builder.io/react";


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

  return (    
    <section>      
      {data?.formid && data?.submitlink && data?.nl ? (
        <form id={data.formid} method="post" action={data.submitlink}>
              <p>                      
                <button className={styles.loginForm} type="submit">              
                  {data.buttonhtml ? (
                    // If custom button HTML is provided, render it using dangerouslySetInnerHTML
                    <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
                  ) : (            
                    // Default button text                     
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
