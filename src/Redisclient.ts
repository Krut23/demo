import * as redis from 'redis';
import dotenv from 'dotenv';

const redisclient = redis.createClient();
dotenv.config();

(async () => {
    await redisclient.connect();
})();


redisclient.on("ready", () => {
    console.log("Redis Connected");
});

redisclient.on("error", (_error: any) => {
    console.log("Error in the Connection");
});