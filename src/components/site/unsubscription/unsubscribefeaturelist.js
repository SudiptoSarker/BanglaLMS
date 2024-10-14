import React from 'react';
import styles from './unsubscribe.module.css';

const features = [
  'ウェブサイトやアプリの迷惑な広告をブロック',
  'ウェブに存在するトラッカーからプライバシーを保護',
  '安全なウェブブラウジング',
  '不適切なコンテンツを制限',
  '不要なコンテンツをブロックして通信量を節約',
  'など'
];

function FeatureList() {
  return (
    <ul className={styles.featureList}>
      {features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
  );
}

export default FeatureList;