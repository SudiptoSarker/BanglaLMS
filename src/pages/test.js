import AnnounceComponent from "@/components/site/announcebanner/announcecomponent";
import Layout from "@/components/site/layout/layout";

export default function TestPage() {
    const handlePaylist = async (serviceID) => {
        const response = await fetch("/api/mopita/paylist?siteMode=0&serviceID="+serviceID)
        const result = await response.json();
        console.log(result);       
    }
    return (
        // Main layout wrapping the page structure.
        <Layout>                 
            <button onClick={() => handlePaylist('R000002750')}>Paylist</button>
            
                      
        </Layout>
    );
}