import React from 'react';
import styles from './unsubscribe.module.css';
import FeatureList from './unsubscribefeaturelist';

/**
 * Unsubscribe Component - Displays a page with cancellation instructions and features
 */
function UnsubscribeComponent({ data }) {
  return (
    <main className={styles.container}>
      {/* Title and warning message */}
      <h1 className={styles.title}>解約前のご注意</h1>
      <p className={styles.warning}>
        キャンセル後は、BDGuard の機能が一切使用できなくなりますのでご注意ください。
      </p>
      
      {/* Section showing the features */}
      <section className={styles.featureSection}>
        <h2 className={styles.featureTitle}>BDGuardの主な機能</h2>
        <FeatureList />
      </section>

      {/* Section for cancellation process */}
      <section className={styles.cancellationSection}>
        <h2 className={styles.cancellationTitle}>解約</h2>
        <p className={styles.thankYouMessage}>
          BDGuardをご利用いただきありがとうございます。
        </p>
        <p className={styles.cancellationInstructions}>
          解約を行う場合は、以下の「解約する」ボタンからお進みください。
        </p>
        <p className={styles.farewell}>
          これまでのご愛顧、誠にありがとうございました。
        </p>
        <div className={styles.buttonContainer}>
          {/* Back button to return to the previous page */}
          <button
            className={styles.backButton}
            type="button"
            onClick={() => history.back()} // Go back on click
          >
            戻る
          </button>     
          
          {/* Form to handle subscription cancellation */}    
          <form id={data.formId} method="post" action={data.submitlink}>
            <p>        
              <button className={styles.cancelButton} type="submit">
                {data.buttonhtml ? (
                  <div dangerouslySetInnerHTML={{ __html: data.buttonhtml }} />
                ) : (            
                  <>                    
                    <p>解約する</p> 
                  </>       
                )}
              </button>
            </p>

            {/* Hidden form inputs for cancellation */}
            <input type="hidden" name="ci" className={styles.hiddenInput} value={data.ci} />
            <input type="hidden" name="act" className={styles.hiddenInput} value={data.act} />
            <input type="hidden" name="nl" className={styles.hiddenInput} value={data.nl} />
            <input type="hidden" name="cl" className={styles.hiddenInput} value={data.cl} />
            <input type="hidden" name="fl" className={styles.hiddenInput} value={data.fl} />
          </form>
        </div>
      </section>
    </main>
  );
}

export default UnsubscribeComponent;
