'use client';
import React from 'react';
import BannerSection from '../banner/bannercomponent';
import Footer from '../footer/footercomponent';
import './layout.module.css';

// Layout component to wrap content with Banner and Footer sections
const Layout = ({ children, globalData }) => {
    return (
        <div className="layout-container">
            {/* Display the banner section at the top */}
            <BannerSection />            
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
