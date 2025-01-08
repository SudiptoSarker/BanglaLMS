import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.get('/payment', async(req,res) => {
    // const response = await fetch(`http://localhost:3000/api/mopita-api`, {
    const response = await fetch(`https://devservice.mopita.ns-mti.com/iai-api/pub/payment.get_paytype_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Mti-Source-Id': 'S00313',
            'X-Iai-Remote-Addr': '127.0.0.1'
        },
        body:{
            'iai_rid':'R000002750',
            'iai_muid':'279d0664343d1bba04',
            // 'iai_uagt':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        }
    });
    const data = await response.json();
    res.status(200).json(data);
    // try{
    //     const response = await fetch(`https://devservice.mopita.ns-mti.com/iai-api/pub/payment.get_paytype_list`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'X-Mti-Source-Id': 'S00313',
    //             'X-Iai-Remote-Addr': '52.173.141.239'
    //         },
    //         body:{
    //             'iai_rid':'R000002750',
    //             'iai_muid':'279d0664343d1bba04',
    //             'iai_uagt':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    //         }
    //     });
    //     const data = await response.json();
    //     res.status(200).json(data);
    // }catch(error){
    //     res.status(500).json({ error: 'Failed to fetch data from external API' , message: error});
    // }
})

server.use(router);

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`JSON server is running on http://localhost:${PORT}`);
});