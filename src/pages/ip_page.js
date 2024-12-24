// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";


export default function UnsubscribedPage() {

    const handleClick = async ()=>{
        let data = await fetch('/api/it_test')
        let ip = await data.json()
        console.log(ip);
    };


    return (
       
        <button onClick={handleClick}>click me to call api</button> 
    );
}
