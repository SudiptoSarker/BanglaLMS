import React from 'react';
import styles from './feature.module.css';
import ServiceCard from './servicecard';

const FeatureSection = () => {
  const services = [
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/67562330c5ca3a8fd013eb01478d308442f7293ccbec58e1b83301c009a2745c?placeholderIfAbsent=true&apiKey=6d2fa06cce744f22a1e3f36901f6ddf3",
      title: "Web&Mobileアプリ",
      description: "BDGuardは基本的にお客様のニーズに合わせて開発プラットフォームと技術者チームを編成して、Web＆Mobileアプリケーション開発をしています。"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/2a8b5f333d81bc1864d71f7e7b07e26b0264fced9dec772449e78dfd2b336dc5?placeholderIfAbsent=true&apiKey=6d2fa06cce744f22a1e3f36901f6ddf3",
      title: "カスタムソフトウェア",
      description: "BDGuardはお客様のビジネス要件を分析し、仕様書のもとにアジャイル方式でカスタムソフトウェア開発をしています。単体テストと統合テストのためにも専用チームを準備しています。"
    },
    {
      iconSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/7e5f712c36241a9c41776b36656a79b2c29b000fcd37ce03f9ac24339d91844d?placeholderIfAbsent=true&apiKey=6d2fa06cce744f22a1e3f36901f6ddf3",
      title: "BDGuardサービス",
      description: "BDGuardはオンライン学校管理システムサービスを提供しています。オンライン申し込みからはじめて学生管理・講師管理・カリキュラム管理・試験及び成績管理、お支払い管理等はお客様のニーズに合わせてカスタマイズも可能となっています"
    }
  ];

  return (
    <section className={styles.featureSections}>
      <h2 className={styles.heading}>特徴</h2>
      <p className={styles.overview}>
        シンプルで安全な自動パスワード管理ですべてのデジタルデバイスでパスワード管理プロセスを簡素化します。
        AndroidやiOSでの使用はもちろんWindowsやMacでも利用が可能です。利用端末数に制限もありません。
      </p>
      <div className={styles.servicesContainer}>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              iconSrc={service.iconSrc}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;