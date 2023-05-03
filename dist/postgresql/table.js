"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
const app = express_1.default();
app.use(express_1.default.json());
dotenv_1.default.config({ path: './config.env' });
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
console.log("PG_CONNECTION_STRING: ", connectionString);
const client = new pg_1.Client({
    connectionString
});
client.connect();
const studentSchema = joi_1.default.object({
    students_id: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    birthdate: joi_1.default.date().required(),
    gender: joi_1.default.string().valid('male', 'female', 'other').required()
});
const resultSchema = joi_1.default.object({
    student_id: joi_1.default.number().required(),
    maths: joi_1.default.number().required(),
    physic: joi_1.default.number().required(),
    chemistry: joi_1.default.number().required(),
    total_marks: joi_1.default.number().required(),
    exam_type: joi_1.default.string().valid('midterm', 'final').required()
});
client.query("CREATE TABLE student (id UUID NOT NULL DEFAULT gen_random_uuid(),students_id integer PRIMARY KEY NOT NULL,name varchar(50) NOT NULL,email varchar(50) NOT NULL,birthdate date NOT NULL,gender varchar(6) NOT NULL),UNIQUE (students_id));", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table student');
    client.end();
});
client.query("CREATE TABLE result (id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),student_id integer ,maths integer NOT NULL,physic integer NOT NULL,chemistry integer NOT NULL,total_marks integer NOT NULL,exam_type VARCHAR(20),FOREIGN KEY (student_id) REFERENCES student(students_id));", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table result');
    client.end();
});
app.listen(4001, () => {
    console.log("server run on 4001");
});
//# sourceMappingURL=table.js.map