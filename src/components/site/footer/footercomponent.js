import React, { useState, useEffect } from 'react';
import styles from './footer.module.css';
import { footerLinks } from './footerlink';
import { fetchTextLinksForFooterSection } from "@/components/api/queryApi";
import { siteid } from '@/helper/helper';

const Footer = () => {
    // State to store footer data from API
    const [footerData, setFooterData] = useState([]);    

    useEffect(() => {        
        getSiteInformation(); // Fetch site info on component mount
    }, []); 
    
    // Function to get site information and fetch footer data
    const getSiteInformation = async () => {
        try {
            const siteId = await siteid();    // Get site ID       
            getFooterData(siteId);      // Fetch footer data based on site ID                               
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Function to fetch footer data from API
    const getFooterData = async (siteId) => {                
        try {            
            const response = await fetchTextLinksForFooterSection(siteId, "FooterLine");
            const mappedData = response.data.map((item,index) => ({
                id: index,
                text: item.text,
                url: item.link, // Change 'link' to 'url' for consistency
            }));
            setFooterData(mappedData);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    

    // Merge footerLinks with data from footerData
    const updatedFooterLinks = footerLinks.map(group => {
        // Check if there's a matching section in footerData
        const updatedLinks = group.links.map(link => {
            const matchingData = footerData.find(data => data.url === link.href && data.section === group.id);
            if (matchingData) {
                // If a match is found, replace text and href
                return { text: matchingData.text, href: matchingData.url }; // Ensure we return a valid href
            }
            return link; // Return original link if no match is found
        });

        return { ...group, links: updatedLinks };
    });

    footerLinks.forEach(group => {
        // Find matching entries in footerData based on the id
        const matches = footerData.filter(item => item.id === group.id);
    
        // Update the links if matches are found
        if (matches.length > 0) {
            // Keep the original structure and update the text and href for each link
            group.links.forEach((link, index) => {
                const match = matches[index]; // Get the corresponding match from footerData
                if (match) {
                    link.text = match.text; // Update text
                    link.href = match.url;  // Update href
                }
            });
        }
    });


    return (
        <footer className={styles.footer}>
            <nav className={styles.middleFooter}>
                {updatedFooterLinks.map((group) => (
                    <div key={group.id} className={styles.linkGroup}>
                        {group.links.map((link, index) => (
                            <React.Fragment key={link.href}>
                                <a href={link.href} className={styles.footerLink}>
                                    {link.text}
                                </a>
                                {index < group.links.length - 1 && (
                                    <span className={styles.separator}>｜</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </nav>
            <div className={styles.bottomFooter}>© 株式会社エムティーアイ</div>
        </footer>
    );
};

export default Footer;
