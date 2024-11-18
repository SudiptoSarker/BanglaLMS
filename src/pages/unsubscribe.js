import Layout from "@/components/site/layout/layout";
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";
import { useRouter } from "next/router";
import { useEffect,useState } from "react";
import { fetchSubscriptionData } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';

export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;

    let uid = query.uid;

    isLogin = validateUserId(uid);
    
    return { props: {
        isLogin: isLogin
    } };
}


export default function UnsubscribePage({isLogin}) {
    const router = useRouter();
    if(!isLogin){
        router.push('/');
    }

    const [unSubscriptionData, setUnubscriptionData] = useState([]);

    useEffect(() => {
        // Fetch subscription data once the domain is set
        getSiteInformation();
    }, []);  

    const getSiteInformation = async () => {
        try {                    
            const siteId = await siteid();
            getSubscriptionData(siteId);       
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    const getSubscriptionData = async (siteId) => {
    try {            
        const response = await fetchSubscriptionData(siteId,"unsubscriptionbutton");
        setUnubscriptionData(response.data);
    } catch (error) {
        console.log("Error fetching subscription data:", error);
    }
    };
    return (
        <Layout globalData={{}}>                      
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
