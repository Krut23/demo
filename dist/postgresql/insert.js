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
client.query("INSERT INTO student (student_id,name,email,birthdate,gender)VALUES (1,'Ankit','ankitpatel11@gmail.com','2002-09-01','Male'),(2,'Bansi','bansi125@gmail.com','2001-06-23','Female'),(3,'Hiren','hirenpatodiya03@gmail.com','2003-10-23','Male'),(4,'Rutvi','rutvizalavadiya@gmail.com','2002-01-10','Female'),(5,'Nirbhay','nirbhaypatel55@gmail.com','2001-04-29','Male');", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' student Data inserted ');
    client.end();
});
client.query("INSERT INTO result (student_id, maths, physic,chemistry,total_marks,exam_type) VALUES (1,85,90,80,255,'midterm'), (1,90,95,92,277,'final'),(2,70,75,80,225,'midterm'),(3,90,92,87,269,'final'),(3,80,85,75,24,'midterm'),(4,72,80,60,212,'midterm'), (5,45,92,55,192,'midterm'),(5,85,70,63,218,'Final');", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('result data inserted ');
    client.end();
});
//# sourceMappingURL=insert.js.map