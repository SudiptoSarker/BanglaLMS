import Layout from "@/components/site/layout/layout";

export async function getServerSideProps(context) {

        const siteMode = '0';
        return {
            props: {
                siteMode: siteMode
            }
        }
    }

export default function TestPage({siteMode}) {
    const handlePaylist = async (serviceID) => {
        const response = await fetch(`/api/mopita/paylist?siteMode=${siteMode}&service=${serviceID}`)
        const result = await response.json();
        console.log(result);       
    }

    const handleBeforePay = async (serviceID, payType) => {
        const response = await fetch(`/api/mopita/beforepay?siteMode=${siteMode}&service=${serviceID}&type=${payType}&action=reg`)
        const result = await response.json();
        console.log(result);       
    }
    return (
        // Main layout wrapping the page structure.
        <Layout>                 
            <button onClick={() => handlePaylist('R000002750')}>Paylist</button>
            <button onClick={() => handleBeforePay('R000002750', '00')}>Paylist</button>

            
                      
        </Layout>
    );
}