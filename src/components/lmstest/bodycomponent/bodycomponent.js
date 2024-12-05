import React from 'react';
import { useState, useEffect } from 'react';
import styles from './body.module.css';
import { fetchTextInformationForTestLMS } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';

 {/* notification component*/}
 const BodyComponent = () => {

    // State to store footer data from API
    const [information1, setInformation1] = useState([]);    
    const [information2, setInformation2] = useState([]);    

    useEffect(() => {        
        getSiteInformation(); // Fetch site info on component mount
    }, []); 
    
    // Function to get site information and fetch footer data
    const getSiteInformation = async () => {
        try {            
            getIfnormation1(59);      // Fetch footer data based on site ID                               
            getIfnormation2(59);      // Fetch footer data based on site ID                               
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    
    const getIfnormation1 = async (siteId) => {                
        try {            
            const response = await fetchTextInformationForTestLMS(siteId,'Information-1');            
            const infoData1 = response.data;
            console.log('infoData1: ',infoData1)  
            if (infoData1 && infoData1.length > 0) {
                setInformation1(infoData1);                
            }                                 
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    const getIfnormation2 = async (siteId) => {                
        try {            
            const response = await fetchTextInformationForTestLMS(siteId,'Information-2');            
            const infoData2 = response.data;
            console.log('infoData2: ',infoData2)  
            if (infoData2 && infoData2.length > 0) {
                setInformation2(infoData2);
            }           
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

  return (
    <main className={styles.mainContent}>
        <div className={styles.columns}>

             {/* Left Column */}
            <div className={styles.infoColumn}>
                <p className={styles.description}>
                    {information1.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.text.split('。').map((line, subIndex) => (
                                <React.Fragment key={`${index}-${subIndex}`}>
                                    {line && line}。
                                    <br />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </p>
            </div>
            <div className={styles.textcolumnseperation}>
            
            </div>
            <div className={styles.infoColumn}>
            <p className={styles.blueDescription}>
                {information2.map((item, index) => (
                    <React.Fragment key={index}>
                        {item.text.split('。').map((line, subIndex) => (
                            <React.Fragment key={`${index}-${subIndex}`}>
                                {line && line}
                                <br />
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
            </p>
            </div>
        </div>
        </main>
  );
};

export default BodyComponent;