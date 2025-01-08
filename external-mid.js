const { default: axios } = require("axios");
const externalAPIMiddleware = (req, res) => {
    // const MOPITADEVAPI = `https://devservice.mopita.ns-mti.com/iai-api/pub/payment.get_paytype_list`;
    const MOPITADEVAPI = `https://devservice.mopita.ns-mti.com/iai-api/pub`;

    axios({
        method: 'POST',
        url: `${MOPITADEVAPI}${req.path}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Mti-Source-Id': 'S00313',
            'X-Iai-Remote-Addr': '52.173.141.239'
        },
        data: {
            'iai_rid':'R000002750',
            'iai_muid':'279d0664343d1bba04',
        }
    }).then((response) => {
        res.status(200).json(response.data);
    }).catch((error)=>{
        res.status(200).json({error: error.message})
    });

}

export default externalAPIMiddleware();