'use client';
import React from 'react';
import HeaderSection from '../bannercomponent/bannercomponent';
// import Footer from '../footercomponent/footercomponent';
import Footer from '../footercomponent/footer';
import styles from './layout.module.css';

// Layout component to wrap content with Banner and Footer sections
const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            {/* Display the banner section at the top */}
            <HeaderSection />

            <main className="content">
                {/* Render the children (main content) */}
                {children}
            </main>
            
            {/* Display the footer section at the bottom */}        
            <Footer />
        </div>
    );
};

export default Layout;
