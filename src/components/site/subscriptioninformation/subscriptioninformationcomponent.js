import React from "react";
import styles from './subscriptioninformation.module.css';

/**
 * This component contains, subscription related informations.
 */
function SubscriptionInfo() {
  return (
    <section className={styles.subscriptionInformation}>
      <div className={styles.container}>
        {/* Heading: Highlights the primary action for users */}
        <h1 className={styles.heading}>
          BDGuardを購入するか、mopitaにログインしてください
        </h1>
        {/* Description: Explains how to subscribe */}
        <p className={styles.infoText}>
          ご利用をご希望の方は、下記の「月額利用登録（入会）　月額275円（税込）」より課金登録
          (入会) を行ってください。
        </p>
        {/* Instructions for existing users */}
        <p className={styles.infoText}>
          すでにBDGuardをご購入いただいている場合は、下記の「mopitaにログイン」をクリックしてログインしてください。
        </p>
        {/* Payment Information: Explains payment methods and policies */}
        <p className={styles.paymentInfo}>
          本サービスは、mopitaの会員ログイン・課金決済機能を利用しています。お支払いに関しては、mopitaが対応してい
          る決済方法、mopitaアカウントに登録されている支払い方法に準じます。
        </p>        
        {/* Subscription Terms: Details about auto-renewal and billing */}  
        <p className={styles.subscriptionRelatedInfo}>
          本サービスは登録完了後から、解約まで1ヶ月ごとの自動契約更新となり、毎月月額料金がかかります。月の途中で本
          サービスを申し込んだ場合や解約した場合でも、月額料金満額をお支払いいただきます。
        </p>
      </div>
    </section>
  );
}

export default SubscriptionInfo;