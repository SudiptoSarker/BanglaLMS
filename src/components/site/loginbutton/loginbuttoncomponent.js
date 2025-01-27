import React from "react";
import styles from './loginbutton.module.css';
import Cookies from 'js-cookie';
import { useState,useEffect } from 'react';
import { Content } from "@builder.io/react";


/**
 * The LoginButton component renders a login form for users who are not already authenticated.
 * It checks for a specific cookie (`iai_mtisess_secure`) to determine the user's login state.
 * If the cookie is not present, the login button is displayed, allowing users to log in.
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

  const handleLogin = () => {
    console.log('Login button clicked');
  };
  
  return (    
    <section>      
      {/* If the cookie is not found, render the login form */}
      {cookieData==null &&
        <>
          <form id={data.formId} method="post" action={data.submitlink}>
            <p>        
              {/* <button className={styles.loginForm} type="submit" onClick={handleLogin} style={{ backgroundColor: data.buttonBgColor }}> */}
              <button
                className={styles.loginForm}
                type="submit"
                onClick={handleLogin}
                style={{
                  background: data.buttoncolor,
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex", // Enable flexbox for alignment
                  alignItems: "center", // Align items vertically in the center
                  justifyContent: "center", // Center items horizontally
                  gap: "10px", // Add space between logo and text
                }}
              >
                {/* Render the logo */}
                <img
                  src={data.logo} // Use the 'logo' node from the passed data
                  alt="login logo"
                  style={{                                     
                    width:"60px",
                    height: "25px",                     
                    objectFit: "contain",
                    float:"right"
                  }}
                />
                {data.buttonhtml ? (
                  // If custom button HTML is provided, render it using dangerouslySetInnerHTML
                  <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
                ) : (            
                  // Default button text                     
                  <>              
                    <p>mopitaにログイン</p> 
                  </>       
                )}
              </button>
            </p>
            {/* Hidden input field to include additional form data */}
            <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />                  
            <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />                  
            <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />                  
            <input type="hidden" name="iai_shortening" className={styles.hiddenInput} value={data.iai_shortening} />                  
            <input type="hidden" name="iai_src_mrkt" className={styles.hiddenInput} value={data.iai_src_mrkt} />                  
          </form>
        </>
      }
    </section>
  );
}

export default LoginButton;
