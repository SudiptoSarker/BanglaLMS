import { queryDatabase } from '@/lib/config';
import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
    {
        let fileName = Date.now() + Math.random()+'_register.txt';

        const filePath = path.resolve('.', 'custom_logs/'+fileName);
        
        let requestString = '';
        requestString += 'headers: '+JSON.stringify(req.headers);
        requestString += '\nbody: '+JSON.stringify(req.body);
        requestString += '\nquery: '+JSON.stringify(req.query);
        requestString += '\ncookies: '+JSON.stringify(req.cookies);
        requestString += '\nBodyType: '+ typeof(JSON.stringify(req.body));
        requestString += '\nBodyType2: '+ typeof(req.body);
        fs.writeFile(filePath,requestString,{flag: 'a+'},(err)=>{
            console.log('File written!');
        });
    }

    
    try{
        //let jsonBody = {"uid":"279d0664343d1bba04","ci":"R000002750","act":"reg","cs":"20241001000000000","iai_tms":"20240904192455905","iai_paytype":"00","iai_ordid":"202409046fc1693bf60e81e074","arg":""};
        // let jsonBody = JSON.parse(req.body);
        let jsonBody = req.body;
        let cs = jsonBody.cs;
        let ci = jsonBody.ci;
        let uid = jsonBody.uid;
        let act = jsonBody.act;
        
        // get site id from ci
        // code here for site id
        
        const date = new Date();
        date.setFullYear(date.getFullYear() + 100);
        res.setHeader('Set-Cookie', `muid=${uid}; Path=/; HttpOnly; Secure; SameSite=None; Expires=${date.toUTCString()}`);
        
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
            
            if(siteDataList.length > 0){
                let siteData = siteDataList[0];
                
                if(siteData.source.toLowerCase() == 'webapi'){
                    // url get from db.
                    //let _url = `http://localhost:3000/api/license-issue?purchase={cs}&subscription={ci}&user={uid}&act={act}`;
                    
                    let _url = siteData.reglink;
                    
                    _url = _url.replace('{cs}',cs);
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
                        
                        let insertQuery = `insert into membertable (siteid,ci,muid,licensekey,validity,status) values
                                            ('${siteId}','${ci}','${uid}','${result.key}','${new Date().toISOString().split('T')[0]}',1);SELECT SCOPE_IDENTITY() AS newId;`;

                                                                   
                        let insertResults = await queryDatabase(insertQuery);
                        
                        if(insertResults[0].newId > 0){

                            {
                                let siteName = siteDataList[0].name;
                                let query = `
                                    INSERT INTO userlogs (muid, pagelink, activity, time)
                                    VALUES (@uid, @pagelink, @activity, @time)
                                `;
                                
                                let params = {
                                    uid: uid,
                                    pagelink: siteName,
                                    activity: 'subscriptions',
                                    time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                                };   
                                 
                                await queryDatabase(query, params);  
                                
                            }
                            res.status(200).send('OK¥n');
                        }
                        else{
                            res.status(200).send('NG¥n');
                            // res.status(200).send({body: 'NG¥n', message: "WebAPI: member table insertion failed"});
                        }
                        
                    }
                    else{
                        res.status(200).send('NG¥n');
                        // res.status(200).send({body: 'NG¥n', message: "WebAPI: issuance API data failed"});
                    }
                    
                }
                else{

                    const queryLicense = `
                            SELECT * from [${siteId}_licensetbl] where ci='${ci}' and active=1
                        `;
                    let licenseData = await queryDatabase(queryLicense);
                    if(licenseData.length > 0){
                        let _validity = new Date(licenseData[0].validity).toISOString();
                        let insertQuery = `insert into membertable (siteid,ci,muid,licensekey,validity,status) values
                                            ('${siteId}','${ci}','${uid}','${licenseData[0].licensekey}','${_validity.split('T')[0]}',1);SELECT SCOPE_IDENTITY() AS newId;`;
                        let insertResults = await queryDatabase(insertQuery);

                        if(insertResults[0].newId > 0){
                            const deactivateQuery = `
                                update [${siteId}_licensetbl] set active=0 where id=${licenseData[0].id}; SELECT @@ROWCOUNT  AS affectedRow;
                            `;
                            let deactivateResult = await queryDatabase(deactivateQuery);
                            if(deactivateResult[0].affectedRow > 0){

                                {
                                    let siteName = siteDataList[0].name;
                                    let query = `
                                        INSERT INTO userlogs (muid, pagelink, activity, time)
                                        VALUES (@uid, @pagelink, @activity, @time)
                                    `;
                                    
                                    let params = {
                                        uid: uid,
                                        pagelink: siteName,
                                        activity: 'subscriptions',
                                        time: new Date().toISOString().split('T')[0] 
                                    };    
                                    await queryDatabase(query, params);  
                                }
                                res.status(200).send('OK¥n');
                            }
                            else{
                                res.status(200).send('NG¥n');
                                // res.status(200).send({body: 'NG¥n', message: "DB: deactive key in license table failed"});
                            }
                        }
                        else{
                            res.status(200).send('NG¥n');
                            // res.status(200).send({body: 'NG¥n', message: "DB: member table insertion failed"});
                        }
                    }
                    else{
                        res.status(200).send('NG¥n');
                        // res.status(200).send({body: 'NG¥n', message: "DB: resource id not found"});
                    }
                }
            }
            else{
                res.status(200).send('NG¥n');
                // res.status(200).send({body: 'NG¥n', message: "site data not found"});
            }
        }
        else{
            res.status(200).send('NG¥n');
            // res.status(200).send({body: 'NG¥n', message: "resource id not found"});
        } 
    }
    catch(error){
        res.status(200).send('NG¥n');
        // res.status(200).send({body: 'NG¥n', message: error.message});
    }

    
}