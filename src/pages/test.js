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
    return (
        // Main layout wrapping the page structure.
        <Layout>                 
            <button onClick={() => handlePaylist('R000002750')}>Paylist</button>
            
                      
        </Layout>
    );
}