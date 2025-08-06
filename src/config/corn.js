import { log } from 'console';
import corn from 'cron';
import https from 'http'


const job = new corn.CronJob("*/14* * * *", function(){
    https.get(process.env.API_URL,(res)=>{
        if(res.statusCode===200)console.log("GET request sent succesfull");
        else console.log("GET request failed",res.statusCode);
        
        
    })
    .on("error",(e)=> console.log("error while sending request ",e));


})

export default job; 