import * as Joi from 'joi';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import {Client} from 'pg';

dotenv.config({ path: './config.env' });

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log("PG_CONNECTION_STRING: ", connectionString);

const client = new Client({
    connectionString
  });
client.connect();
const app = express();
app.use(express.json());

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

client.query(
    "INSERT INTO student (students_id,name,email,birthdate,gender)VALUES (1,'Ankit','ankitpatel11@gmail.com','2002-09-01','Male'),(2,'Bansi','bansi125@gmail.com','2001-06-23','Female'),(3,'Hiren','hirenpatodiya03@gmail.com','2003-10-23','Male'),(4,'Rutvi','rutvizalavadiya@gmail.com','2002-01-10','Female'),(5,'Nirbhay','nirbhaypatel55@gmail.com','2001-04-29','Male');", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' student Data inserted ');
});

client.query(
    "INSERT INTO result (student_id, maths, physic,chemistry,total_marks,exam_type) VALUES (1,85,90,80,255,'midterm'), (1,90,95,92,277,'final'),(2,70,75,80,225,'midterm'),(3,90,92,87,269,'final'),(3,80,85,75,24,'midterm'),(4,72,80,60,212,'midterm'), (5,45,92,55,192,'midterm'),(5,85,70,63,218,'Final');", (err, res) => {
        if (err) {console.error(err);
            return;
}
console.log('result data inserted ');
});

app.listen(4002, () => {
    console.log("server run on 4002");
    });