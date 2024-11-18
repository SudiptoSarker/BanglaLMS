// Import the Layout component
import Layout from "@/components/site/layout/layout";
import UnsubscribedComponent from "@/components/site/unsubscription/unsubscribedcomponent";
import { useRouter } from "next/router";
import { validateUserId } from '@/helper/helper';

export async function getServerSideProps(context) {
    const {query} = context;
    let isLogin = false;

    let uid = query.uid;

    isLogin = validateUserId(uid);
    
    return { props: {
        isLogin: isLogin
    } };
}



export default function UnsubscribedPage({isLogin}) {
    const router = useRouter();
    if(!isLogin){
        router.push('/');
    }

    return (
        <Layout globalData={{}}>              
            <UnsubscribedComponent  />                        
        </Layout>
    );
}
