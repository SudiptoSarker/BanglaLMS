import { queryDatabase } from '@/lib/config';
import fs from 'fs'
import path from 'path'
import { siteid,isNullOrEmpty } from '@/helper/helper';
import { getMemberList,insertMember,createUserLog,getCI,getMemberListByOrderId } from '@/components/api/queryApi';

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

    let isMember = false;
    let activity='request';

    let cs = '';
    let ci = '';
    let uid = '';
    let act = '';
    let orderId = '';
    let orderTime='';
    let payType='';

    try{

        let jsonBody = req.body;
         cs = jsonBody.cs;
         ci = jsonBody.ci;
         uid = jsonBody.uid;
         act = jsonBody.act;
         orderId = jsonBody.iai_ordid;
         orderTime=jsonBody.iai_tms;
         payType=jsonBody.iai_paytype;

        //dev code
        // cs = '2292932R750';
        // ci = '2292932R850';
        // uid = '01675203399';
        // act = 'reg';
        // orderId = 'ord-2';
        // orderTime='1.42';
        // payType='card';

       
        if(isNullOrEmpty(cs) || isNullOrEmpty(ci) || isNullOrEmpty(uid) || isNullOrEmpty(orderId)){
            throw new Error("Invalid Data!");
        }

    }
    catch(error){
        res.status(200).send('NG¥n');
    }

     // check member by order id
     let memberListByOrderId = await getMemberListByOrderId(siteId,ci,uid,orderId);

    if(memberListByOrderId.data.length > 0){
        let firstMember = memberListByOrderId[0];
        if(firstMember.licensekey != null && firstMember.licensekey.length > 0){
            res.status(200).send('OK¥n');
        }
        else{
            res.status(200).send('NG¥n');
        }
    }
    else{
        try{
            // dev
            //let jsonBody = {"uid":"279d0664343d1bba04","ci":"R000002750","act":"reg","cs":"20241001000000000","iai_tms":"20240904192455905","iai_paytype":"00","iai_ordid":"202409046fc1693bf60e81e074","arg":""};
            // let jsonBody = JSON.parse(req.body);
        
            
            let siteId = await siteid();
    
            // check member
            let memberList = await getMemberList(siteId,ci,uid);
    
            if(memberList.data.length > 0){
                isMember = true;
            }
            else{
    
                let _ci = await getCI(siteId,ci);
                if(_ci.data.length > 0){
    
                    let memberObject = {
                        siteId:siteId,
                        ci:ci,
                        uid:uid,
                        orderId:orderId,
                        orderTime:orderTime,
                        payType:payType,
                        isMember:1,
                        cs:cs,
                        category:_ci.data[0].category
                    };
    
                    let createMember = await insertMember(memberObject);
    
                    if(createMember.data[0].newId > 0){
                        isMember = true;
                        activity = 'subscriptions';
                    }
                }
    
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
                    activity:activity,
                    time:new Date().toISOString().replace('T', ' ').substring(0, 19) 
                };
    
                let response = await createUserLog(userLog);
            }
            catch(error){
            }
            
        }
    
        if(isMember){
            res.status(200).send('OK¥n');
        }
        else{
            res.status(200).send('NG¥n');
        }
    }

  

    
}