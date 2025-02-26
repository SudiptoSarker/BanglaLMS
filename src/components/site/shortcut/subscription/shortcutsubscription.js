import React from 'react';
import { useState,useEffect } from 'react';
import styles from './shortcutsubscription.module.css';
import Cookies from 'js-cookie';
import PaymentList from './paymentList';
import LoginRequired  from './loginrequired';
import { getPaymentData } from "@/components/api/queryApi";

function ShortcutSubscription({ data, user = null, isLogin,siteMode }) {
  const handleSubscriptionPurchase = async (resource, user) => {
    try{
      if(resource && user){
        // const paylist = await fetch(`/api/mopita/paylist?siteMode=${siteMode}&service=${resource}`)
        const paylist = await fetch(`https://stgbanglalms.mopita.com/api/mopita/paylist?siteMode=0&service=R000002750`)
        
        const result = await paylist.json();
        return result;
      }
    } catch (error) {
      console.error('Error fetching paylist:', error);
      return {error: error};
    }
  }  

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loginCat, setLoginCat] = useState('');

  // Get the 'logincat' cookie value when the component mounts
  useEffect(() => {
    const logincatValue = Cookies.get('logincat');
    if (logincatValue) {
      setLoginCat(logincatValue);
    }
  }, []);

  const toggleModal = async (e) => {
    e.preventDefault(); 
    if (!isLogin) {
      setLoginModalOpen(true); // Open the login modal
      return;
    }
  
    // Get the value of the hidden input field with name="ci"
    // const ciValue = document.querySelector(`input[name="ci"]`)?.value;
    const ciValue = data.ci;
    
    if (ciValue && user) {
      // Call the handleSubscriptionPurchase function with ciValue and user
      const result = await handleSubscriptionPurchase(ciValue, user);
            
      if (result?.result?.paytypelist) {
        const paylistResponse = result.result.paytypelist;        
        
        const payTypeResponse = await getPaymentData();    
        const payTypeData = payTypeResponse.data;

        const filteredPaylistData = paylistResponse.map(item => {
          const matchingPayment = payTypeData.find(pay => pay.code === item.paytype_info.paytype);
      
          return {
              paytype_info: {
                  ...item.paytype_info,
                  paytype_name: item.paytype_info.paytype_name || matchingPayment?.name,
                  payment_link: matchingPayment?.link || null
              }
          };
        });
        setPaymentMethods(filteredPaylistData);       
      }      
    } else {
      console.warn("CI value or user is missing");
    }  
    setModalOpen(!isModalOpen);
  };  

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseLoginModal = () => setLoginModalOpen(false);  

  return (  
    <>        
    {data &&
      data.formId ? (
      <form id={data.formId} method="post" >
        <p>
          {/* Button to submit the subscription */}
          <button className={styles.button} type="button" onClick={toggleModal}>
            {/* If buttonhtml is provided, render it directly */}
            {data.buttonhtml ? (
              <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
            ) : (
              <>
                {/* Display device info if no custom button HTML */}
                <div className={styles.deviceInfo}>
                  <p className={styles.deviceLabel}>モバイル/PC 合計</p>
                  <div className={styles.deviceCount}>
                    <span className={styles.countNumber}>{data.devicecount}</span>
                    <span className={styles.countUnit}>{data.deviceunit}</span>
                  </div>
                </div>
                <p className={styles.subscriptionInfo}>月額利用登録 {data.price}円 (税込)</p>
              </>
            )}
          </button>
        </p>    
        <input type="hidden" name="ci" className={styles.hiddenInput} value={data.ci} />
        <input type="hidden" name="act" className={styles.hiddenInput} value={data.act} />
        <input type="hidden" name="iai_acc_create" className={styles.hiddenInput} value="0" />        
        <input type="hidden" name="iai_logincat" className={styles.hiddenInput} value={loginCat} />
        <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
        <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
        <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />
        <input type="hidden" name="iai_paytype" className={styles.hiddenInput} value="14" />
      </form>
    ) : null}                
      {isModalOpen && (
        <PaymentList 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          paymentMethods={paymentMethods} // Pass the dynamic payment methods
          formId={data.formId} // Pass form ID
          ci={data.ci} // Pass CI value          
        />
      )}
      <LoginRequired isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />
    </>
  );
};
export default ShortcutSubscription;
