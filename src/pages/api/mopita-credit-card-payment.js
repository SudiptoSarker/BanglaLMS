import crypto from "crypto";

export default async function handler(req, res) {
    // try {
        const CREDITCARDPAYMENTAPI = "https://devwww.mopita.com/cp/credit_period/purchase"


        const access_key = process.env.NEXT_PUBLIC_MOPITA_ACCESS_KEY;
        const secret_key = process.env.NEXT_PUBLIC_MOPITA_SECURITY_KEY;

        const date = new Date();
        const options = {
            timeZone: 'Asia/Tokyo', // Replace with your desired timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(date);

        const formattedDate = parts.find(part => part.type === 'year').value +
                    parts.find(part => part.type === 'month').value +
                    parts.find(part => part.type === 'day').value +
                    parts.find(part => part.type === 'hour').value +
                    parts.find(part => part.type === 'minute').value +
                    parts.find(part => part.type === 'second').value +
                    '000';

        let postData = {
            'iai_aver': '1.0',
            'iai_akey': access_key,
            'iai_atms': formattedDate,

            'iai_logincat': '0009',
            'act': 'reg',
            // 'iai_ruid': 'a0565c5d4697e8b1b9',
            'ci': 'R000002769',
            // 'iai_paytype': '00',
            'nl': 'https://stgbanglalms.mopita.com/top',
            'cl': 'https://stgbanglalms.mopita.com/top',
            'fl': 'https://stgbanglalms.mopita.com/',
        };

        const jsonString = JSON.stringify(postData);
        const iai_req = encodeURIComponent(btoa(jsonString));

        const hmac = crypto.createHmac('sha256', secret_key).update(jsonString).digest('base64');
        const base64String = hmac.toString('base64');

        const iai_sig = encodeURIComponent(base64String);

        const bodyData = `iai_req=${iai_req}&iai_sig=${iai_sig}`;

       
        const response = await fetch(CREDITCARDPAYMENTAPI,{
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'X-Mti-Source-Id': 'S00313',
                'X-Iai-Remote-Addr': '52.173.141.239'
            },
            body: bodyData
        });
        console.log(response);
        // let result = await response.json();
        // let result = {};
        res.status(200).json({result: response, data: postData});
    // }catch(error){
    //     res.status(200).json({error: error});
    // }
}