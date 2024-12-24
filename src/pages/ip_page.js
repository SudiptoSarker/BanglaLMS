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


    return (
       
        <button onClick={handleClick}>click me to call api</button> 
    );
}
