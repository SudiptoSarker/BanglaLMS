import React from 'react';
import { useState } from 'react';
import styles from './shortcutsubscription.module.css';
import Cookies from 'js-cookie';
import PaymentList from './paymentList';


function ShortcutSubscription({ data, user=null }) {

  const handleSubscriptionPurchase = async (resource, user) => {
    try{
      if(resource && user){
        const paylist = await fetch(`/api/mopita-paylist-api?serviceID=${resource}&user=${user}`);
        const result = await paylist.json();
        return result;
      }
    } catch (error) {
      console.error('Error fetching paylist:', error);
      return {error: error};
    }
  }  

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);

  const toggleModal = async (e) => {
    e.preventDefault(); // Prevent form submission
  
    // Get the value of the hidden input field with name="ci"
    const ciValue = document.querySelector(`input[name="ci"]`)?.value;
  
    if (ciValue && user) {
      // Call the handleSubscriptionPurchase function with ciValue and user
      const result = await handleSubscriptionPurchase(ciValue, user);
      let tempData = {
        "result": {
            "paytypelist": [
                {
                    "paytype_info": {
                        "paytype": "00",
                        "paytype_name": "クレジットカード決済",
                        "runningflg": "1",
                        "stoptext": null,
                        "displaycode": "1",
                        "selectflg": "0",
                        "linktype": "0"
                    }
                }
                // ,
                // {
                //     "paytype_info": {
                //         "paytype": "01",
                //         "paytype_name": "MasterCard",
                //         "runningflg": "1",
                //         "stoptext": null,
                //         "displaycode": "1",
                //         "selectflg": "0",
                //         "linktype": "0"
                //     }
                // },
                // {
                //     "paytype_info": {
                //         "paytype": "02",
                //         "paytype_name": "American Express",
                //         "runningflg": "1",
                //         "stoptext": null,
                //         "displaycode": "1",
                //         "selectflg": "0",
                //         "linktype": "0"
                //     }
                // }
            ],
            "message_list": [
                {
                    "line_list": [
                        {
                            "message_info": {
                                "message": "各支払い方法については"
                            }
                        },
                        {
                            "message_info": {
                                "message": "Q&A",
                                "link_url": "http://mti7.okbiz.okwave.jp/faq/show/3591?site_domain=mopitafaq001"
                            }
                        },
                        {
                            "message_info": {
                                "message": "をご確認ください。"
                            }
                        }
                    ]
                }
            ],
            "result": {
                "code": "I000",
                "args": [
                    ""
                ]
            }
        },
        "data": {
            "iai_aver": "1.0",
            "iai_akey": "597e2b0fdb6cef96cb",
            "iai_atms": "20250127195740000",
            "iai_rid": "R000002769",
            "iai_muid": "a0565c5d4697e8b1b9",
            "iai_uagt": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        }
      }

      if (tempData?.result?.paytypelist) {
        console.log('result.result.paytypelist: ',tempData.result.paytypelist);
        setPaymentMethods(tempData.result.paytypelist); // Store the paytypelist
      }

      // Log or handle the result as needed
      console.log("Subscription Purchase Result:", result);
    } else {
      console.warn("CI value or user is missing");
    }
  
    // Toggle the modal
    setModalOpen(!isModalOpen);
  };
  

  const handleOptionClick = (option) => {
    setSelectedPaymentOption(option); // Set the selected option
    document.getElementById(data.formId).submit(); // Submit the form
  };

  const handleCloseModal = () => setModalOpen(false);

  return (  
    <>        
    {data &&
      data.formId &&
      data.submitlink ? (
      <form id={data.formId} method="post" action={data.submitlink}>
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
                {/* Show subscription price */}
                <p className={styles.subscriptionInfo}>月額利用登録 {data.price}円 (税込)</p>
              </>
            )}
          </button>
        </p>
    
        {/* Hidden inputs for form submission */}
        <input type="hidden" name="ci" className={styles.hiddenInput} value={data.ci} />
        <input type="hidden" name="act" className={styles.hiddenInput} value={data.act} />
        <input type="hidden" name="iai_acc_create" className={styles.hiddenInput} value="0" />
        <input type="hidden" name="iai_logincat" className={styles.hiddenInput} value="0009" />
        <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
        <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
        <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />
      </form>
    ) : null}
    
      {/* Payment Method Modal */}
      {isModalOpen && (
        <PaymentList 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          paymentMethods={paymentMethods} 
        />
      )}
    </>
  );
};

export default ShortcutSubscription;
