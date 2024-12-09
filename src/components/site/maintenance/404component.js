import styles from './404.module.css';

const ErrorHandling = () => {
  return (
    <div className={styles.container}>
      {/* Add the 404 GIF */}
      <img src="/images/404.gif" alt="404 Error" className={styles.errorImage} />
      
      {/* Add a message */}
      <h1 className={styles.title}>Oops! Page Not Found</h1>
      <p className={styles.message}>
        {/* The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. */}
      </p>
      
      {/* Add a button to go back to the homepage */}
      {/* <a href="/" className={styles.homeButton}>Go Back to Homepage</a> */}
    </div>
  );
};

export default ErrorHandling;
