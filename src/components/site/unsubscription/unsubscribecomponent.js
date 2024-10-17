import React from 'react';
import styles from './unsubscribe.module.css';
import FeatureList from './unsubscribefeaturelist';

function UnsubscribeComponent() {
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

          {/* Cancel Button */}
          <form
            id="formWithDraw"
            action="https://devwww.mopita.com/cp/regist"
            method="post"
          >
            <p>
              <button
                className={styles.cancelButton}
                type="submit" // Submit the form
              >
                解約する
              </button>
            </p>
            <input type="hidden" name="ci" value="R000002007" />
            <input type="hidden" name="act" value="rel" />
            <input type="hidden" name="nl" value="https://stgadg.mopita.com/unsubscribed" />
            <input type="hidden" name="cl" value="https://stgadg.mopita.com/top" />
            <input type="hidden" name="fl" value="https://stgadg.mopita.com/top" />
          </form>
        </div>
      </section>
    </main>
  );
}

export default UnsubscribeComponent;
