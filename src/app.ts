import express from "express";
import {Pool} from 'pg';
import './postgresql/table';
import './postgresql/insert';

const app = express();

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "user"
});

pool.connect();

app.get('/student', async (req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM student');
      res.json({"message":"Student Table", data: [result.rows]});
    } finally {
      client.release();
    }
  });

  app.get('/result', async (req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM result');
      res.json({"message":"Result Table", data: [result.rows]});
    } finally {
      client.release();
    }
  });


app.listen(3333, () => {
console.log("server run on 3333");
});
