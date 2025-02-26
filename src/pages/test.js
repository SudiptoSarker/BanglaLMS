import Layout from "@/components/site/layout/layout";

export async function getServerSideProps(context) {

    const {query} = context;

    const orderid = query.orderid || '0iUNJX%2Bdz%2Bfpf3GbYXoDdG8Acexp%2BQlL1uAQ%2BXVx2oY%3D';

        const siteMode = '0';
        return {
            props: {
                siteMode: siteMode,
                order: orderid
            }
        }
    }

export default function TestPage({siteMode, order}) {
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

    const handleAfterPay = async (serviceID, payType, orderID) => {
        const response = await fetch(`/api/mopita/afterpay?siteMode=${siteMode}&service=${serviceID}&type=${payType}&order=${orderID}&action=reg`)
        const result = await response.json();
        console.log(result);       
    }

    return (
        // Main layout wrapping the page structure.
        <Layout>
            <input type="text" name="serviceid" id="serviceid" />                 
            <input type="text" name="paytype" id="paytype"/>                 
            <button onClick={() => handlePaylist(document.getElementById('serviceid').value)}>Paylist</button>
            <button onClick={() => handleBeforePay(document.getElementById('serviceid').value, document.getElementById('paytype').value)}>Before Pay</button>         
            <button onClick={() => handleAfterPay(document.getElementById('serviceid').value, document.getElementById('paytype').value, order )}>After Pay</button>         

                      
        </Layout>
    );
}