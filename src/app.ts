import express, { Request, Response } from 'express';
import * as redis from 'redis';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Joi from 'joi';
import './Redisclient';


dotenv.config();
const app = express();
const url = process.env.REDIS_URL;
const redisClient = redis.createClient({
url
});
const port = 3005;

app.use(bodyParser.json());

interface Result {
Fname: string;
Lname: string;
Age: number;
Contact: number;
Email: string;
password: string;
confirmpassword: string;
}

const schema = Joi.object({
Fname: Joi.string().required(),
Lname: Joi.string().required(),
Age: Joi.number().integer().min(0).required(),
Contact: Joi.number().integer().min(0).required(),
Email: Joi.string().email().required(),
password: Joi.string().min(8).required(),
confirmpassword: Joi.string().valid(Joi.ref('password')).required(),
});

app.use(express.json());

app.post('/post', async (req: Request, res: Response) => {
const { error, value } = schema.validate(req.body);

if (error) {
return res.status(400).json({ error: error.details });
}

const keyName: string = 'mydetail1';

const result: Result = {
Fname: value.Fname,
Lname: value.Lname,
Age: value.Age,
Contact: value.Contact,
Email: value.Email,
password: value.password,
confirmpassword: value.confirmpassword,
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

// send success response here
res.status(200).json(responseArray);
} catch (err) {
console.error(`Error while getting/setting Redis cache: ${err}`);
res.status(500).json({ error: 'Internal Server Error' }); 
} 
});

app.listen(port, () => {
console.log(`App is listening at http://localhost:${port}`);
});

