"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "user"
});
client.connect();
client.query("CREATE TABLE student (id UUID NOT NULL DEFAULT gen_random_uuid(),student_id integer PRIMARY KEY NOT NULL,name varchar(50) NOT NULL,email varchar(50) NOT NULL,birthdate date NOT NULL,gender varchar(6) NOT NULL);", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table student');
    client.end();
});
client.query("CREATE TABLE result (id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),student_id integer ,maths integer NOT NULL,physic integer NOT NULL,chemistry integer NOT NULL,total_marks integer NOT NULL,exam_type VARCHAR(20),FOREIGN KEY (student_id) REFERENCES student(student_id));", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created table result');
    client.end();
});
//# sourceMappingURL=table.js.map