import React from "react";
import { useState,useEffect } from 'react';
import styles from './shortcutlogin.module.css';

import { fetchShortcutLoginURL } from "@/components/api/queryApi";

/**
 * The ShortcutLogin component renders a login form for users who are not already authenticated. 
 */
function ShortcutLogin({ data }) {     
  const [shortUrl,setShortUrl] = useState('');
  const [srcMrkt,setSrcMrkt] = useState('');  

  const getShortcutLoginURL = async (loginOption) => {                
    try {            
        const response = await fetchShortcutLoginURL(loginOption);        
        if (response?.data?.length > 0) {
            const loginInfo = response.data[0];  // Extract the first object from response.data array
            setShortUrl(loginInfo.link);   
            setSrcMrkt(loginInfo.srcMrkt);
        }
        
    } catch (error) {
        console.log("Error fetching login data:", error);
    }
  };  

  const getShortcutLoginInfo = async () => {
        try {  
            getShortcutLoginURL(data.loginOption);          
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
  };

  useEffect(() => {
    getShortcutLoginInfo();
  }, []); 
  return (       
    <section>
      {data?.formid && shortUrl && data?.nl && data?.cl && data?.fl && srcMrkt ? (
        <form id={data.formid} method="post" action={shortUrl}>
          <p>
          <button className={styles.googleLoginBtn} type="submit">
              {data.buttonhtml ? (
                <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
              ) : (
                <p>Partner Login</p>
              )}
            </button>
          </p>

          {/* Hidden input fields */}
          <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
          <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
          <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />
          <input type="hidden" name="iai_shortening" className={styles.hiddenInput} value="1" />
          <input type="hidden" name="iai_src_mrkt" className={styles.hiddenInput} value={srcMrkt} />
        </form>
      ) : null}
    </section>

  );
}

export default ShortcutLogin;
