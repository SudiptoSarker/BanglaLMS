import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './qrcode.module.css';
import { fetchQRCodeData } from '@/components/api/queryApi';
import { siteid } from '@/helper/helper';

function AnshinStoreQRCode({ licenseKey }) {
  const [currentTime, setCurrentTime] = useState(null); 
  const [scannedTime, setScannedTime] = useState(''); 
  const [qrUrl, setQrUrl] = useState(''); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  // Fetch QR code data from the API
  const getAnshinStoreInfo = async () => {
    try {
      const siteId = await siteid();      
      const response = await fetchQRCodeData(siteId, 'AnshinstoreSection');      

      if (response?.data?.length > 0) {
        const qrCodeInfo = response.data[0]; // Extract the first object from response.data array        

        // Create a JSON object with token and timer
        const jsonData = {
          token: btoa(licenseKey), // Encode licenseKey using Base64
          timer: scannedTime, // Use the scanned time
        };

        // Convert JSON object to string and encode it
        const encodedJsonData = encodeURIComponent(JSON.stringify(jsonData));

        // Replace {token} in the link with the encoded JSON string
        const newQrUrl = qrCodeInfo.link.replace('{token}', encodedJsonData);

        // Set the new QR code URL
        setQrUrl(newQrUrl);
        setIsLoading(false); // Data fetched successfully
      } else {
        setError('No QR code data found.'); // Handle empty response
        setIsLoading(false);
      }
    } catch (error) {
      console.log('Error fetching QR code data:', error);
      setError('Failed to fetch QR code data. Please try again.'); // Handle API error
      setIsLoading(false);
    }
  };

  // Update scanned time every second
  useEffect(() => {
    const now = new Date();
    setScannedTime(encodeURIComponent(now.toISOString())); // Store time in ISO format for accuracy

    // const interval = setInterval(() => {
    //   const now = new Date();
    //   setScannedTime(encodeURIComponent(now.toISOString()));
    // }, 1000);

    // return () => clearInterval(interval);
  }, []);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch QR code data on component mount or when licenseKey/scannedTime changes
  useEffect(() => {
    getAnshinStoreInfo();
  }, [licenseKey, scannedTime]);

  // Format time (12-hour format with AM/PM)
  let year, month, date, hours12, minutes, secondsFormatted, ampm;
  if (currentTime !== null) {
    year = currentTime.getFullYear();
    month = String(currentTime.getMonth() + 1).padStart(2, '0');
    date = String(currentTime.getDate()).padStart(2, '0');
    const hours24 = currentTime.getHours();
    hours12 = hours24 % 12 || 12;
    minutes = String(currentTime.getMinutes()).padStart(2, '0');
    secondsFormatted = String(currentTime.getSeconds()).padStart(2, '0');
    ampm = hours24 >= 12 ? 'PM' : 'AM';
  }

  // Render loading state
  if (isLoading) {
    return (
      <section className={styles.container}>
        <div className={styles.loading}>
          <p>Loading QR code...</p>
        </div>
      </section>
    );
  }

  // Render error state
  if (error) {
    return (
      <section className={styles.container}>
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  // Render the main content
  return (
    <section className={styles.container}>
      {/* QR Code Display */}
      <div className={styles.qrContainer}>
        <QRCodeCanvas value={qrUrl} size={150} />
      </div>

      {/* Real-Time Clock with Live Updates */}
      <div className={styles.timeDisplay}>
        <p>
          {currentTime !== null ? (
            <>
              Time: {year}/{month}/{date},{' '}
              <span className={styles.time}>
                {hours12}:{minutes}:{secondsFormatted} {ampm}
              </span>
            </>
          ) : null}
        </p>
      </div>     
    </section>
  );
}

export default AnshinStoreQRCode;