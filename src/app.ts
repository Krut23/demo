import express,{ Request, Response } from 'express';
import * as redis from 'redis';
import { promisify } from 'util';

interface Result {
  Fname: string;
  Lname: string;
  Age: number;
  Contact: number;
}

const app = express();
const port: number = 3004;

const redisClient = redis.createClient();


const redisGetAsync = promisify(redisClient.get).bind(redisClient);

redisClient.connect();
redisClient.on('connect', () =>  {
  console.log('connected Redis');
});

app.get('/', async (req: Request, res: Response) => {
  const keyName: string = 'mydetail';

let result: Result = {
  Fname: 'krutik',
  Lname: 'Undhad',
  Age: 22,
  Contact: 9978050389,
};

  let responseArray: Result = result;

  try {
    const getCachedata: string | null = await redisClient.get(keyName);
    if (getCachedata) {
      responseArray = JSON.parse(getCachedata) as Result;
      console.log('GET Cache');
    } else {
      console.log('SET Cache');
      redisClient.set(keyName, JSON.stringify(result));
    }
  } catch (err) {
    console.error(`Error while getting/setting Redis cache: ${err}`);
  
  }

  res.status(200).json(responseArray);
});
app.listen(port,()=>{
  console.log(`App is listening at http://localhost:${port}`)
})





