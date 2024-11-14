import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export default function handler(req, res){
    try {
        let fileName = Date.now() + Math.random()+'_uid.txt';

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
        // return NextResponse.redirect(new URL('/member', req.url));
        res.setHeader('X-Customer-Identity', req.query.uid?req.query.uid:'');
        return res.redirect(302,'/');
        
        // return res.status(200).json({success: true});
    }catch(error){
        return res.status(200).json({success: false, error: error.message});
    }

    
}