'use client';
import React, { useEffect, useState } from 'react';
import BannerSection from '../banner/bannercomponent';
import Footer from '../footer/footercomponent';
import './layout.module.css';
import { useRouter } from 'next/router';

const Layout = ({ children, globalData }) => {
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
