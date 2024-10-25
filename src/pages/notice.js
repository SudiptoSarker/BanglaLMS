// Import the Layout component
import Layout from "@/components/site/layout/layout";
import Instructions from "@/components/site/notice/noticecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function NoticePage({ globalData }) {
    const router = useRouter();
    useEffect(() => {
        if(!globalData.auth){
            // router.push('/');
        }
    }, [router]);

    return (
        <Layout globalData={globalData}>                  
            <Instructions  />            
        </Layout>
    );
}
