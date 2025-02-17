import { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';  // Import QR code generator
import Layout from "@/components/site/layout/layout";
import HeaderComponent from "@/components/site/header/headercomponent";
import NotificationComponent from "@/components/site/notificationbanner/notificationcomponent";
import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import FeatureSection from "@/components/site/feature/featurecomponent";
import SubscriptionInfo from "@/components/site/subscriptioninformation/subscriptioninformationcomponent";
import SubscriptionButton from "@/components/site/subscriptionbutton/subscriptionbuttoncomponent";
import ShortcutSubscription from "@/components/site/shortcut/subscription/shortcutsubscription";
import LoginButton from "@/components/site/loginbutton/loginbuttoncomponent";
import ShortcutLogin from '@/components/site/shortcut/login/shortcutlogin';
import LogoutButton from '@/components/site/logoutbutton/logoutbutton';
import TopPageComponent from "@/components/site/top/toppagecomponent";
import { fetchLoginData, fetchSubscriptionData, fetchNotificationsAndAnnouncements, getMemberResourceCatByUid, getSiteInfo } from "@/components/api/queryApi";
import { siteid, validateUserId, checkSubscription } from '@/helper/helper';

export async function getServerSideProps(context) {
    const { query } = context;
    let isLogin = false;
    let isMember = false;
    let _skippableCategories = [];
    let _skippableResources = [];

    let siteId = await siteid();
    let uid = query.uid;
    isLogin = validateUserId(uid);

    if (isLogin) {
        let subscriptionData = await checkSubscription(uid);
        if (subscriptionData) {
            isMember = true;
            let _memberList = await getMemberResourceCatByUid(uid, siteId);
            if (_memberList.data.length > 0) {
                _skippableCategories = _memberList.data.map(x => x.category);
                _skippableResources = _memberList.data.map(x => ({ ci: x.ci, servicename: x.servicename }));
            }
        }
    }

    return {
        props: {
            userId: uid || null,
            isLogin,
            isMember,
            skippableCategories: _skippableCategories,
            skippableResources: _skippableResources
        }
    };
}

export default function HomePage({ userId, isLogin, isMember, skippableCategories, skippableResources }) {
    const [notifications, setNotifications] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [loginData, setLoginData] = useState([]);
    const [isProduction, setIsProduction] = useState(true);
    const [isMopita, setIsMopita] = useState(true);
    const [qrValue, setQrValue] = useState("");  // QR Code State

    useEffect(() => {
        const fetchData = async () => {
            try {
                const siteId = await siteid();
                const response = await getSiteInfo(siteId);
                if (response?.data?.length > 0) {
                    setIsProduction(response.data[0].isProduction);
                    setIsMopita(false);
                }

                const subscriptionResponse = await fetchSubscriptionData(siteId, "DeviceSubscriptionButton");
                setSubscriptionData(subscriptionResponse.data);

                const loginResponse = await fetchLoginData(siteId, "LoginSection");
                setLoginData(loginResponse.data);

                const notificationData = await fetchNotificationsAndAnnouncements(siteId, "notificationbanner");
                setNotifications(notificationData.data);

                const announceData = await fetchNotificationsAndAnnouncements(siteId, "announcebanner");
                setAnnouncements(announceData.data);

                // Generate a QR Code for the user's profile page (or any relevant data)
                if (userId) {
                    setQrValue(`https://yourwebsite.com/user/${userId}`);
                }
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <Layout>
            <HeaderComponent />

            {notifications.map((notification, index) => (
                <NotificationComponent key={index} text={notification.text} href={notification.link} />
            ))}

            {announcements.map((announcement, index) => (
                <AnnounceComponent key={index} {...announcement} />
            ))}

            <FeatureSection />
            <SubscriptionInfo />

            {subscriptionData
                .filter(option => !skippableCategories.includes(option.category))
                .map((option, index) =>
                    isMopita ? (
                        <SubscriptionButton key={index} data={option} user={userId} />
                    ) : (
                        <ShortcutSubscription key={index} data={option} user={userId} />
                    )
                )}

            {isLogin && isMember && (
                <>
                    <div style={{ textAlign: 'center' }}>
                        <h2>BDGuardメンバーシップページへ</h2>
                        <p style={{ fontSize: '16px', marginTop: '30px' }}>
                            ライセンスキーの確認とアプリのダウンロードは、下記の「会員ページ」から行ってください。
                        </p>
                    </div>
                    {skippableResources.map((item, index) => (
                        <TopPageComponent key={index} ci={item.ci} servicename={item.servicename} />
                    ))}
                </>
            )}

            {!isLogin ? (
                isMopita ? (
                    loginData.map((option, index) => <LoginButton key={index} data={option} />)
                ) : (
                    loginData.map((option, index) => <ShortcutLogin key={index} data={option} />)
                )
            ) : (
                <LogoutButton />
            )}

            {/* QR Code Section */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <h3>Scan this QR Code</h3>
                <QRCodeCanvas value={qrValue} size={200} />
                <p style={{ marginTop: '10px' }}>Your unique QR code for quick access.</p>
            </div>
        </Layout>
    );
}
