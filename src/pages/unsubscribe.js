'use client'
import Layout from "@/components/site/layout/layout";
import UnsubscribeComponent from "@/components/site/unsubscription/unsubscribecomponent";
import { useEffect,useState } from "react";
import { fetchSubscriptionData } from "@/components/api/queryApi";
import { siteid,validateUserId } from '@/helper/helper';
import { useRouter } from "next/router";

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

    const [unSubscriptionData, setUnubscriptionData] = useState([]); 

    const getSiteInformation = async () => {
        try {                    
            const siteId = await siteid();
            getSubscriptionData(siteId);       
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };
    
    // Function to fetch unsubscription-related data based on the site ID.
    const getSubscriptionData = async (siteId) => {
        try {            
            const response = await fetchSubscriptionData(siteId,"unsubscriptionbutton");
            setUnubscriptionData(response.data);
        } catch (error) {
            console.log("Error fetching subscription data:", error);
        }
    };

    useEffect(() => {
        if(!isLogin){
            router.push('/');
        }
        getSiteInformation();
    },[router]);
    
    return (
        <Layout>                      
            {unSubscriptionData.map((option, index) => (
                <UnsubscribeComponent key={index} data={option} />
            ))}                  
        </Layout>
    );
}
