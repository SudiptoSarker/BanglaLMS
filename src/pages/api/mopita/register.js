import { queryDatabase } from '@/lib/config';
import fs from 'fs'
import path from 'path'
import { siteid } from '@/helper/helper';

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
        let orderId = '';
        let orderTime='';
        let payType='';
        
        
        let isMember = false;
        let siteId = await siteid();
        // new code will start from here.


        // check member
        const queryGetMember = `select * from membertable  where muid='${uid}'`;
        let memberList = await queryDatabase(queryGetMember);
        if(memberList.length > 0){
            isMember = true;
        }
        else{
            let insertQuery = `insert into membertable (siteid,ci,muid,orderId,ordertime,paytype,ismember,licensekey,validity) values
                            ('${siteId}','${ci}','${uid}','${orderId}','${orderTime}','${payType}',1,'',null);SELECT SCOPE_IDENTITY() AS newId;`;

                               
            let insertResults = await queryDatabase(insertQuery);
            if(insertResults[0].newId > 0){
                isMember = true;
            }

        }

        // creating user log.
        {
            //let siteName = siteDataList[0].name;
            let query = `
                INSERT INTO userlogs (muid, pagelink, activity, time)
                VALUES (@uid, @pagelink, @activity, @time)
            `;
            
            let params = {
                uid: uid,
                pagelink: '',
                activity: 'subscriptions',
                time: new Date().toISOString().replace('T', ' ').substring(0, 19) 
            };    
            await queryDatabase(query, params);  
            
        }

        if(isMember){
            res.status(200).send('OK¥n');
        }
        else{
            res.status(200).send('NG¥n');
        }
        
    }
    catch(error){
        res.status(200).send('NG¥n');
        // res.status(200).send({body: 'NG¥n', message: error.message});
    }

    
}