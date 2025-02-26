import React from 'react';
import styles from './unsubscribe.module.css';

/**
 * Unsubscribe Form Component - Displays the button with unsubscribe form data
 */
function UnsubscribeFormComponent({ data }) {
  return (
    <>
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
    </>
  );
}

export default UnsubscribeFormComponent;