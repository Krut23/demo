const express = require('express');
const app = express();
const port = 3001;



const redis = require('redis');
const redisClient = redis.createClient(6379,'127.0.0.1');

redisClient.connect();
redisClient.on("connect",function(err){
    console.log("connected Redis")
})

app.get("/",async (req,res)=>{

    let keyName = 'mydetail';
    let getCachedata = await redisClient.get(keyName);
    let result = {
        Fname:'krutik',
        Lname:'Undhad',
        Age:22,
        Contact:99780-50389
    }
    let responseArray='';
    if(getCachedata){
        responseArray=JSON.parse(getCachedata)
        console.log("GET Cache")
    }else{
        console.log('SET Cache')
        redisClient.set(keyName,JSON.stringify(result),{EX:30});
        responseArray=result;
    }

    console.log(getCachedata)
    res.status(200).json(responseArray)
})

app.listen(port,()=>{
    console.log(`App is listening at http://localhost:${port}`)
})


