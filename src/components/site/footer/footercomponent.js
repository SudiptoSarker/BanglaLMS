import React from 'react';
import styles from './Footer.module.css';
import { footerLinks } from './footerlink';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.middleFooter}>
        {footerLinks.map((group) => (
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