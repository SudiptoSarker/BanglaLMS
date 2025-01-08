export default async function handler(req, res) {
    const MOPITADEVAPI = `https://devservice.mopita.ns-mti.com/iai-api/pub/payment.get_paytype_list`;
    try {
        const response = await fetch(MOPITADEVAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Mti-Source-Id': 'S00313',
                'X-Iai-Remote-Addr': '52.173.141.239'
            },
            body:{
                'iai_rid':'R000002750',
                'iai_muid':'279d0664343d1bba04',
                'iai_uagt':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            }
        });
        let result = await response.json();
        res.status(200).json({result: result});
        
    }catch(error){
        res.status(200).json({error: error});
    }
}