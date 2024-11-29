import { queryDatabase } from '@/lib/config';
import fs from 'fs'
import path from 'path'
import { siteid,isNullOrEmpty } from '@/helper/helper';
import { getSubscribedDataByService,getSiteInfo,createUserLog,deleteDataFromMemberTable } from '@/components/api/queryApi';

export default async function handler(req, res) {
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
            console.log('Release File written!');
        });
    }
    
    let ci='';
    let uid = '';
    let act = '';


    try{

        let jsonBody = req.body;
        ci = jsonBody.ci;
        uid = jsonBody.uid;
        act = jsonBody.act;

        //dev code
        // ci = 'R000002750';
        // uid = '015752033990000000';
        // act = 'rel';

        if(isNullOrEmpty(ci) || isNullOrEmpty(uid)){
            throw new Error("Invalid Data!");
        }
        if(act!='rel'){
            throw new Error("Invalid Request!");
        }
    }
    catch(error){
        res.status(200).send('NG¥n');
    }

    try{

        let siteId = await siteid();
        let memberInfo = await getSubscribedDataByService(siteId,uid,ci);
        if(memberInfo.data.length > 0){
            let siteInfo = await getSiteInfo(siteId);
            if(siteInfo.data.length > 0){
                let siteData = siteInfo.data[0];
                if(siteData.source.toLowerCase() == 'webapi'){

                    let _url = siteData.rellink;
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
                        let deleteResult = await deleteDataFromMemberTable(siteId,uid,ci);
                        deleteResult.data[0].affectedRow > 0 ? res.status(200).send('OK¥n') : res.status(200).send('NG¥n');
                        
                    }else{
                        res.status(200).send('NG¥n');
                    }

                }else{
                    let deleteResult = await deleteDataFromMemberTable(siteId,uid,ci);
                    deleteResult.data[0].affectedRow > 0 ? res.status(200).send('OK¥n') : res.status(200).send('NG¥n');
                }
            }else{
                res.status(200).send('NG¥n');
            }
        }else{
            res.status(200).send('OK¥n');
        }
    }
    catch(error){
        res.status(200).send('NG¥n');
    }finally{
        try{
            // creating user log.
            let userLog  = {
                uid:uid,
                pageLink:'',
                activity:'unsubscriptions',
                time:new Date().toISOString().replace('T', ' ').substring(0, 19) 
            };

            let response = await createUserLog(userLog);
        }
        catch(error){
        }
    }

    
}