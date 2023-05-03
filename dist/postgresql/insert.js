"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config({ path: './config.env' });
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
console.log("PG_CONNECTION_STRING: ", connectionString);
const client = new pg_1.Client({
    connectionString
});
client.connect();
const app = express_1.default();
app.use(express_1.default.json());
const createStudentSchema = Joi.object({
    students_id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    birthdate: Joi.date().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
});
const createResultSchema = Joi.object({
    student_id: Joi.number().required(),
    maths: Joi.number().required(),
    physic: Joi.number().required(),
    chemistry: Joi.number().required(),
    total_marks: Joi.number().required(),
    exam_type: Joi.string().valid('midterm', 'final').required(),
});
client.query("INSERT INTO student (students_id,name,email,birthdate,gender)VALUES (1,'Ankit','ankitpatel11@gmail.com','2002-09-01','Male'),(2,'Bansi','bansi125@gmail.com','2001-06-23','Female'),(3,'Hiren','hirenpatodiya03@gmail.com','2003-10-23','Male'),(4,'Rutvi','rutvizalavadiya@gmail.com','2002-01-10','Female'),(5,'Nirbhay','nirbhaypatel55@gmail.com','2001-04-29','Male');", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' student Data inserted ');
});
client.query("INSERT INTO result (student_id, maths, physic,chemistry,total_marks,exam_type) VALUES (1,85,90,80,255,'midterm'), (1,90,95,92,277,'final'),(2,70,75,80,225,'midterm'),(3,90,92,87,269,'final'),(3,80,85,75,24,'midterm'),(4,72,80,60,212,'midterm'), (5,45,92,55,192,'midterm'),(5,85,70,63,218,'Final');", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('result data inserted ');
});
app.listen(4002, () => {
    console.log("server run on 4002");
});
//# sourceMappingURL=insert.js.map