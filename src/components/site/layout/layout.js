'use client';
import React from 'react';
import { useRouter } from 'next/router';
import BannerSection from '../banner/bannercomponent';
import Footer from '../footer/footercomponent';
import './layout.module.css'; 

const Layout = ({ children }) => {    
    return (
        <div className="layout-container">
            <BannerSection />            
            <main className="content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
