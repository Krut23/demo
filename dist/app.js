"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis = __importStar(require("redis"));
const util_1 = require("util");
const app = express_1.default();
const port = 3004;
const redisClient = redis.createClient();
const redisGetAsync = util_1.promisify(redisClient.get).bind(redisClient);
redisClient.connect();
redisClient.on('connect', () => {
    console.log('connected Redis');
});
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const keyName = 'mydetail';
    let result = {
        Fname: 'krutik',
        Lname: 'Undhad',
        Age: 22,
        Contact: 9978050389,
    };
    let responseArray = result;
    try {
        const getCachedata = yield redisClient.get(keyName);
        if (getCachedata) {
            responseArray = JSON.parse(getCachedata);
            console.log('GET Cache');
        }
        else {
            console.log('SET Cache');
            redisClient.set(keyName, JSON.stringify(result));
        }
    }
    catch (err) {
        console.error(`Error while getting/setting Redis cache: ${err}`);
    }
    res.status(200).json(responseArray);
}));
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map