'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Clipboard, Check, AlertCircle } from 'lucide-react';
import styles from './serviceconfirm.module.css';
import { fetchMemberData } from '@/components/api/queryApi';

function ServiceConfirm() {
  const router = useRouter();
  const { token } = router.query;

  // Parse the token data
  let tokenData = null;
  if (token) {
    try {
      const decodedToken = decodeURIComponent(token);
      tokenData = JSON.parse(decodedToken);
    } catch (error) {
      console.error('Error parsing token data:', error);
    }
  }

  // Decode the token only if tokenData is available
  const decodedToken = tokenData?.token ? atob(decodeURIComponent(tokenData.token)) : 'N/A';

  // Set countdown duration (e.g., 2 minutes)
  const countdownDuration = 300; // in seconds

  // Calculate dynamic thresholds for timer status
  const dangerThreshold = countdownDuration * 0.2; // Last 20% of the countdown
  const warningThreshold = countdownDuration * 0.5; // Last 50% of the countdown

  // Parse the scanned time from query string
  const scannedTime = tokenData?.timer ? new Date(decodeURIComponent(tokenData.timer)) : null;

  // Store the initial page load date
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(countdownDuration);
  const [copySuccess, setCopySuccess] = useState(false);
  const [joiningDate, setJoiningDate] = useState('Loading...'); // Initialize with loading state
  const [validityPeriod, setValidityPeriod] = useState('Loading...'); // Initialize with loading state
  const [isLoading, setIsLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Format the QR generation time
  const formatQRGenerationTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(decodeURIComponent(dateString));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  };

  // Get the formatted QR generation time
  const qrGenerationTime = tokenData?.timer ? formatQRGenerationTime(tokenData.timer) : 'N/A';

  // Fetch member data from the API
  const fetchMemberDetails = async () => {
    try {
      const response = await fetchMemberData(decodedToken); // Pass the decoded token as a parameter
      console.log('API Response:', response);
      if (response?.data?.length > 0) {
        const memberData = response.data[0]; // Extract the first object from response.data array
        console.log('Member Data:', memberData);

        // Extract ordertime and format it as 'YYYY-MM-DD'
        const orderTime = memberData.ordertime;
        console.log('orderTime:', orderTime);
        const formattedJoiningDate = formatDate(orderTime);
        setJoiningDate(formattedJoiningDate);

        // Extract validity and format it as 'X year(s) Y month(s)'
        const validityDate = memberData.validity;
        const formattedValidityPeriod = calculateValidityPeriod(validityDate);
        setValidityPeriod(formattedValidityPeriod);

        setIsLoading(false); // Data fetched successfully
      } else {
        setError('No member data found.'); // Handle empty response
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      setError('Failed to fetch member data. Please try again.'); // Handle API error
      setIsLoading(false);
    }
  };

  // Format ordertime to 'YYYY-MM-DD'
  const formatDate = (dateString) => {
    // Extract year, month, and day from the timestamp
    const year = dateString.slice(0, 4); // First 4 digits = year
    const month = dateString.slice(4, 6); // Next 2 digits = month
    const day = dateString.slice(6, 8); // Next 2 digits = day
    console.log('dateString:', dateString);
    // Return in 'YYYY-MM-DD' format
    return `${year}-${month}-${day}`;
  };

  // Calculate validity period in 'X year(s) Y month(s)' format
  const calculateValidityPeriod = (validityDate) => {
    const currentDate = new Date();
    const endDate = new Date(validityDate);

    let years = endDate.getFullYear() - currentDate.getFullYear();
    let months = endDate.getMonth() - currentDate.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    return `${years} year(s) ${months} month(s)`;
  };

  // Fetch member data on component mount
  useEffect(() => {
    if (decodedToken !== 'N/A') {
      fetchMemberDetails();
    }
  }, [decodedToken]);

  // Calculate elapsed time and update countdown
  useEffect(() => {
    if (!scannedTime) return;

    const elapsedTime = Math.floor((new Date() - scannedTime) / 1000);
    const remainingTime = Math.max(countdownDuration - elapsedTime, 0);
    setCountdown(remainingTime);
  }, [scannedTime]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Copy ID to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(decodedToken);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  if (countdown <= 0) {
    return (
      <div className={styles.expiredPage}>
        <AlertCircle size={64} className={styles.expiredIcon} />
        <h1>Timeout</h1>
        <p><strong>Please scan the QR Code again to continue.</strong></p>
      </div>
    );
  }

  const minutesLeft = Math.floor(countdown / 60);
  const secondsLeft = countdown % 60;

  // Determine timer status for dynamic styling
  const timerStatus = countdown <= dangerThreshold ? 'danger' : countdown <= warningThreshold ? 'warning' : 'normal';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Anshin Store Support Service</h1>
      <div className={styles.infoContainer}>
        {/* QR Generation Time */}
        <div className={styles.qrGenerationTime}>
          <p>QR Generation: <span className={styles.qrGenerationText}>{qrGenerationTime}</span></p>
        </div>

        {/* ID Container */}
        <div className={styles.idContainer}>
          <p>ID: <span className={styles.idText}>{decodedToken}</span></p>
          <button className={styles.copyButton} onClick={copyToClipboard}>
            {copySuccess ? <Check size={18} /> : <Clipboard size={18} />}
          </button>
          {copySuccess && <span className={styles.copySuccess}>Copied!</span>}
        </div>

        {/* Timer Container */}
        <div className={`${styles.timerContainer} ${styles[timerStatus]}`}>
          <div className={styles.timerCircle}>
            <p className={styles.timer}>
              {minutesLeft}:{String(secondsLeft).padStart(2, '0')}
            </p>
          </div>
          <p className={styles.timerText}>
            {timerStatus === 'danger' ? (
              <span className={styles.timerWarning}>Hurry! Time is running out.</span>
            ) : (
              <span className={styles.timerMessage}>Minutes left to use the code</span>
            )}
          </p>
        </div>

        {/* Details Container */}
        <div className={styles.detailsContainer}>
          <p>Membership Category: <span className={styles.detailValue}>Member</span></p>
          <p>Joining Date: <span className={styles.detailValue}>{joiningDate}</span></p>
          <p>Validity Period: <span className={styles.detailValue}>{validityPeriod}</span></p>
        </div>
      </div>
    </div>
  );
}

export default ServiceConfirm;