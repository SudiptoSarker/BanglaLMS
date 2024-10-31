// Import the Layout component
import Layout from "@/components/site/layout/layout";
import Instructions from "@/components/site/notice/noticecomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function NoticePage() {

    return (
        <Layout globalData={{}}>                  
            <Instructions  />            
        </Layout>
    );
}
