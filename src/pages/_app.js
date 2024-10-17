import { checkSubscription } from "@/helper/helper";
import "@/styles/globals.css";
import Cookies from "js-cookie";
import { useState } from "react";

export default function App({ Component, pageProps }) {
  const [globalData, setGlobalData] = useState([]);
  let susbscribeStatus = false;  
  const [isSubscribed, setSubscribeStatus] = useState(false);

  useState(()=>{
    const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
    const uidCookie = Cookies.get('muid') || null;

    const subcribeData = async(uidCookie) => {
      const result = await checkSubscription(uidCookie);
      const  susbscribeStatus = result ? true : false;
      console.log(susbscribeStatus);
      setGlobalData({auth: authCookie, isSubscribed: susbscribeStatus});
      setSubscribeStatus(susbscribeStatus);
    };

    if(authCookie && uidCookie){        
        subcribeData(uidCookie);
    }
    setGlobalData({auth: authCookie, isSubscribed: isSubscribed});
  },[])


  return <Component {...pageProps} globalData={globalData} />;
}
