// Main layout component wrapping the page structure.
import Layout from "@/components/site/layout/layout";

export async function getServerSideProps(context) {
    //const forwarded = req.headers["x-forwarded-for"]
    //const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
    
    console.log('server context:\n',context)
    return {
      props: {
        context:'done'
      },
    }
  }

export default function UnsubscribedPage({context}) {

    const handleClick = async ()=>{
        let data = await fetch('/api/it_test')
        let ip = await data.json()
        console.log(ip);

        console.log(context)
    };

    const plannerCall = async ()=>{
      const res = await fetch('http://localhost:3001/api/ip_test');
      let result = await res.json();
      console.log(result);
        // let data = await fetch('https://stgplanner.imasale.com/api/ip_test')
        // let ip = await data.json()
        // console.log(ip);
    };


    return (       
        <>
        <button onClick={handleClick}>Internal Call</button> 
        <button onClick={plannerCall}>Planner Call</button> 
        </>
    );
}
