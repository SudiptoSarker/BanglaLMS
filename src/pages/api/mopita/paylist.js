import crypto from 'crypto';
import { MopitaAPIBaseURL } from '@/lib/config';

export default async function handler(req, res) {
    // Request validation
    if (req.method !== 'GET') {
        return res.status(405).send({ error: 'Method not allowed' });
    }

    try{
        const access_key = process.env.NEXT_PUBLIC_MOPITA_ACCESS_KEY; // get access key from environment variable
        const secret_key = process.env.NEXT_PUBLIC_MOPITA_SECURITY_KEY; // get secret key from environment variable

        const userAgent = req.headers['user-agent']; // extract user agent from request headers
        const { service, siteMode, uid } = req.query; // extract information from query parameters

        // Validate required parameters
        if(!access_key || !secret_key || !userAgent || !service || !siteMode || !uid) {
            throw new Error('Missing required parameters');
        }

        const apiBaseURL = siteMode === '1' ? MopitaAPIBaseURL.production : MopitaAPIBaseURL.staging; // determine API base URL based on site mode
        const apiURL = apiBaseURL + 'iai-api/pub/payment.get_paytype_list'; // construct API URL

        // fomat date time for JP timezone
        const date = new Date(); // get current date
        const options = {
            timeZone: 'Asia/Tokyo', // Set JP timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // 24-hour format
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedParts = formatter.formatToParts(date);
        const formattedDate = formattedParts.find(part => part.type === 'year').value +
                            formattedParts.find(part => part.type === 'month').value +
                            formattedParts.find(part => part.type === 'day').value +
                            formattedParts.find(part => part.type === 'hour').value +
                            formattedParts.find(part => part.type === 'minute').value +
                            formattedParts.find(part => part.type === 'second').value +
                            '000';
                            
        let postData = {
            'iai_aver': '1.0',
            'iai_akey': access_key,
            'iai_atms': formattedDate,

            'iai_rid': service,
            'iai_muid': uid,
            'iai_uagt': userAgent,
        }

        // Request Encoded
        const iai_req = encodeURIComponent(btoa(JSON.stringify(postData)));

        // Signature Encryption Encoded
        const hmac = crypto.createHmac('sha256', secret_key).update(JSON.stringify(postData)).digest('base64');
        const iai_sig = encodeURIComponent(hmac.toString('base64'));

        // Stringify Body request data
        const bodyData = `iai_req=${iai_req}&iai_sig=${iai_sig}`;

        // Send request to MOPITA API
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Mti-Source-Id': 'S00313',
                'X-Iai-Remote-Addr': '52.173.141.239'
            },
            body: bodyData
        });

        // Prepare MOPITA response
        const result = await response.json();

        return res.status(200).send({
            success: true,
            result,
        });
    }catch (error) {
        return res.status(200).send({
            success: false,
            error: error,
        });
    }
}