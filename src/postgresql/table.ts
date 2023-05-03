import express from 'express';
import Joi from 'joi';
import dotenv from 'dotenv';
import { Client } from 'pg';

const app = express();
app.use(express.json());
dotenv.config({ path: './config.env' });


const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log("PG_CONNECTION_STRING: ", connectionString);

const client = new Client({
    connectionString
  });
  client.connect();

const studentSchema = Joi.object({
    students_id: Joi.number().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    birthdate: Joi.date().required(),
    gender: Joi.string().valid('male', 'female', 'other').required()
});

const resultSchema = Joi.object({
    student_id: Joi.number().required(),
    maths: Joi.number().required(),
    physic: Joi.number().required(),
    chemistry: Joi.number().required(),
    total_marks: Joi.number().required(),
    exam_type: Joi.string().valid('midterm', 'final').required()
});
client.query(
    "CREATE TABLE student (id UUID NOT NULL DEFAULT gen_random_uuid(),students_id integer PRIMARY KEY NOT NULL,name varchar(50) NOT NULL,email varchar(50) NOT NULL,birthdate date NOT NULL,gender varchar(6) NOT NULL),UNIQUE (students_id));", (err: any, res: any) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table student');
        client.end();
})


client.query(
    "CREATE TABLE result (id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),student_id integer ,maths integer NOT NULL,physic integer NOT NULL,chemistry integer NOT NULL,total_marks integer NOT NULL,exam_type VARCHAR(20),FOREIGN KEY (student_id) REFERENCES student(students_id));", (err: any, res: any) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table result');
        client.end();
})
app.listen(4001, () => {
    console.log("server run on 4001");
    });