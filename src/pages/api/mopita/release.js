import { queryDatabase } from '@/lib/config';
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {

    try{

        // custom log
        {
            let fileName = Date.now() + Math.random()+'_release.txt';

            const filePath = path.resolve('.', 'custom_logs/'+fileName);
            
            let requestString = '';
            requestString += 'headers: '+JSON.stringify(req.headers);
            requestString += '\nbody: '+JSON.stringify(req.body);
            requestString += '\nquery: '+JSON.stringify(req.query);
            requestString += '\ncookies: '+JSON.stringify(req.cookies);
            fs.writeFile(filePath,requestString,{flag: 'a+'},(err)=>{
                console.log('File written!');
            });
        }


        //let jsonBody = {"uid":"279d0664343d1bba04","ci":"R000002750","act":"rel","cs":"20241001000000000","iai_tms":"20240904192455905","iai_paytype":"00","iai_ordid":"202409046fc1693bf60e81e074","arg":""};
        let jsonBody = JSON.stringify(req.body);
        //let cs = jsonBody['cs'];
        let ci = jsonBody['ci'];
        let uid = jsonBody['uid'];
        let act = jsonBody['act'];

        // get site id from ci
        // code here for site id
        const queryGetSite = `select * from resources  where resource='${ci}'`;
        let resourceList = await queryDatabase(queryGetSite);
        if(resourceList.length > 0){

            let siteId=resourceList[0].siteId;

            const query = `
            SELECT id, name, source, reglink, rellink, sourcetable AS tableName
            FROM [dbo].[sites]
            WHERE active = 1 and id=${siteId}
                `;
            let siteDataList = await queryDatabase(query);
            //let _url = `http://localhost:3000/api/license-release?cancel={ci}&user={uid}&act={act}`;
            
            if(siteDataList.length > 0){
                let siteData = siteDataList[0];

                if(siteData.source.toLowerCase() == 'webapi'){
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
                            {
                                let siteName = siteDataList[0].name;
                                let query = `
                                    INSERT INTO userlogs (muid, pagelink, activity, time)
                                    VALUES (@uid, @pagelink, @activity, @time)
                                `;
                                
                                let params = {
                                    uid: uid,
                                    pagelink: siteName,
                                    activity: 'unsubscriptions',
                                    time: new Date().toISOString().split('T')[0] 
                                };    
                                await queryDatabase(query, params);  
                            }
                            res.status(200).send('OK¥n');
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
                    let insertQuery = `update membertable set status=0 where ci='${ci}' and muid='${uid}'; SELECT @@ROWCOUNT  AS affectedRow;`;
                    let insertResults = await queryDatabase(insertQuery);

                    if(insertResults[0].affectedRow > 0){
                        {
                            let siteName = siteDataList[0].name;
                            let query = `
                                INSERT INTO userlogs (muid, pagelink, activity, time)
                                VALUES (@uid, @pagelink, @activity, @time)
                            `;
                            
                            let params = {
                                uid: uid,
                                pagelink: siteName,
                                activity: 'unsubscriptions',
                                time: new Date().toISOString().split('T')[0] 
                            };    
                            await queryDatabase(query, params);  
                        }
                        res.status(200).send('OK¥n');
                    }
                    else{
                        res.status(200).send('NG¥n');
                    }
                }
            }
            else{
                res.status(200).send('NG¥n');
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