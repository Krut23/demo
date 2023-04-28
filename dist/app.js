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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
require("./postgresql/table");
require("./postgresql/insert");
const app = express_1.default();
const pool = new pg_1.Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "user"
});
pool.connect();
app.get('/student', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query('SELECT * FROM student');
        res.json({ "message": "Student Table", data: [result.rows] });
    }
    finally {
        client.release();
    }
}));
app.get('/result', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query('SELECT * FROM result');
        res.json({ "message": "Result Table", data: [result.rows] });
    }
    finally {
        client.release();
    }
}));
app.listen(3333, () => {
    console.log("server run on 3333");
});
//# sourceMappingURL=app.js.map