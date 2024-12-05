import React, { useState, useEffect } from 'react';
import styles from './footer.module.css';
import { fetchTextLinksForFooterSection } from "@/components/api/queryApi";

const Footer = () => {
    // State to store footer data from API
    const [footerData, setFooterData] = useState([]);    

    let footerSectionList = "'FooterLine-1','FooterLine-2','FooterLine-3'"
    useEffect(() => {        
        getSiteInformation(); // Fetch site info on component mount
    }, []); 
    
    // Function to get site information and fetch footer data
    const getSiteInformation = async () => {
        try {            
            getFooterData(59);      // Fetch footer data based on site ID                               
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Function to fetch footer data from API
    const getFooterData = async (siteId) => {                
        try {            
            const response = await fetchTextLinksForFooterSection(siteId,footerSectionList);            
            const footerData = response.data;

            // Transform footerData to the grouped structure
            const groupedFooterLinks = footerData.reduce((acc, item) => {
                const { section, text, link } = item;

                // Find or create a group for the current section
                let group = acc.find(group => group.id === section);
                if (!group) {
                    group = { id: section, links: [] };
                    acc.push(group);
                }

                // Add the link to the group
                group.links.push({ text, href: link.trim() });
                return acc;
            }, []);

            setFooterData(groupedFooterLinks);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    return (
        <footer className={styles.footer}>            
            <nav className={styles.middleFooter}>
                {footerData.map((group) => (
                    <div key={group.id} className={styles.linkGroup}>
                        {group.links.map((link, index) => (
                            <React.Fragment key={`${group.id}-${index}`}>
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
        </footer>
    );
};

export default Footer;
