import { queryDatabase } from '@/lib/config';

export default async function handler(req, res) {

    try{
        let jsonBody = {"uid":"279d0664343d1bba04","ci":"R000002750","act":"rel","cs":"20241001000000000","iai_tms":"20240904192455905","iai_paytype":"00","iai_ordid":"202409046fc1693bf60e81e074","arg":""};
        //let jsonBody = JSON.stringify(req.body);
        //let cs = jsonBody['cs'];
        let ci = jsonBody['ci'];
        let uid = jsonBody['uid'];
        let act = jsonBody['act'];

        // get site id from ci
        // code here for site id
        let siteId=95;

        
         const query = `
            SELECT id, name, source, reglink, rellink, sourcetable AS tableName
            FROM [dbo].[sites]
            WHERE active = 1 and id=${siteId}
        `;
        let siteDataList = await queryDatabase(query);
        //let _url = `http://localhost:3000/api/license-release?cancel={ci}&user={uid}&act={act}`;
        
        if(siteDataList.length > 0){
            let siteData = siteDataList[0];

            if(siteData.tableName==null){
                let _url = siteData.rellink;

                //_url = _url.replace('{cs}',cs);
                _url = _url.replace('{ci}',ci);
                _url = _url.replace('{uid}',uid);
                _url = _url.replace('{act}',act);

                let queryString = _url.substring(_url.indexOf('?')+1,_url.length);

                const response = await fetch(_url, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    query: queryString
                });
                let result = await response.json();

                if(result.success){

                    let insertQuery = `update membertable set status=0 where ci='${ci}' and muid='${uid}'; SELECT @@ROWCOUNT  AS affectedRow;`;
                    let insertResults = await queryDatabase(insertQuery);

                    if(insertResults[0].affectedRow > 0){
                        res.status(200).send('OK¥n')
                    }
                    else{
                        res.status(200).send('NG¥n');
                    }

                }
                else{
                    res.status(200).send('NG¥n');
                }
            }
            else{
                res.status(200).send('for db');
            }
        }
        else{
            res.status(200).send('NG¥n');
        }
    }
    catch(error){
        res.status(200).send('NG¥n');
    }

    
}