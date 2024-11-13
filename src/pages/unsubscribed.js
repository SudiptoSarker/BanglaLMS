// Import the Layout component
import Layout from "@/components/site/layout/layout";
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from 'js-cookie'; 

export default function UnsubscribedPage() {
    const router = useRouter();
    useEffect(() => {
        const authCookie = Cookies.get('iai_mtisess') && Cookies.get('iai_mtisess_secure') ? true : false;
        if(!authCookie){
            router.push('/');
        }
    }, [router]);

    return (
        <Layout globalData={{}}>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
