import React from 'react';
import styles from './unsubscribe.module.css';
import FeatureList from './unsubscribefeaturelist';

function UnsubscribeComponent({ data }) {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>解約前のご注意</h1>
      <p className={styles.warning}>
        キャンセル後は、BDGuard の機能が一切使用できなくなりますのでご注意ください。
      </p>
      <section className={styles.featureSection}>
        <h2 className={styles.featureTitle}>BDGuardの主な機能</h2>
        <FeatureList />
      </section>
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
          {/* Back Button */}
          <button
            className={styles.backButton}
            type="button"
            onClick={() => history.back()} // Go back on click
          >
            戻る
          </button>         
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
