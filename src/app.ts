import express, { Request, Response } from 'express';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import Joi from 'joi';
import bodyParser from 'body-parser';
// import './postgresql/table.ts';
// import './postgresql/insert.ts';


dotenv.config({ path: './config.env' });
const app = express();
app.use(bodyParser.json());

const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;

console.log("PG_CONNECTION_STRING: ", connectionString);

const pool = new Pool({
    connectionString
  });

pool.connect();

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


// student all api
app.get('/students', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM student');
      res.json({"message":"Student Table", data: [result.rows]});
    } finally {
      client.release();
    }
  });

  app.get('/students/:students_id', (req: Request, res: Response) => {
    const studentId = req.params.students_id;
    pool.query(
        'SELECT * FROM student WHERE students_id = $1',
        [studentId],
        (err: any, result: any) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching result records');
            }
            if (result.rows.length === 0) {
                return res.status(404).send(`No student records found for student with ID: ${studentId}`);
            }
            return res.json({"message":"Student Table", data: [result.rows]});
        }
    );
});

//ADD  student record
app.post('/students', async (req: Request, res: Response) => {
  const { error, value } = createStudentSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const { students_id, name, email, birthdate, gender } = value;
  const query = {
    text: 'INSERT INTO student (students_id, name, email, birthdate, gender) VALUES ($1, $2, $3, $4, $5)',
    values: [students_id, name, email, birthdate, gender],
  };
  try {
    await pool.query(query);
    res.status(201).send({"message":`Student Table student id ${students_id} Added`, data: [{ students_id, name, email, birthdate, gender }]});
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Database error' });
  }
});

// Update student record 
app.put('/students/:students_id', (req: Request, res: Response) => {
  const studentId = req.params.students_id;
  const { name, email, birthdate, gender } = req.body;

  pool.query(
    'UPDATE student SET name = $1, email = $2, birthdate = $3, gender = $4 WHERE students_id = $5',
    [name, email, birthdate, gender, studentId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating student record');
      }

      pool.query(
        'UPDATE result SET student_id = $1 WHERE student_id = $2',
        [studentId, studentId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error updating result record');
          }
          const updatedRow = {name, email, birthdate, gender };
          return res.send({"message":`Student Table student id ${studentId} Updated`, data:[updatedRow]});
        }
      );
    }
  );
});


// Delete student record 
app.delete('/students/:students_id', (req: Request, res: Response) => {
  const studentId = req.params.students_id;
  const { name, email, birthdate, gender } = req.body;

  pool.query(
    'DELETE FROM result WHERE student_id = $1',
    [studentId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error deleting student record');
      }
      pool.query(
        'DELETE FROM student WHERE students_id = $1',
        [studentId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error deleting student record');
          }
          const deletedRow = {name, email, birthdate, gender };
          return res.send({"message":`Student Table student id ${studentId} Deleted`, data:[deletedRow]});
        }
      );
    }
  );
});


// result all api
app.get('/results', async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM result');
      res.json({"message":"Result Table", data: [result.rows]});
    } finally {
      client.release();
    }
  });

  app.get('/results/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    pool.query(
        'SELECT * FROM result WHERE student_id = $1',
        [studentId],
        (err: any, result: any) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching result records');
            }
            if (result.rows.length === 0) {
                return res.status(404).send(`No result records found for student with ID: ${studentId}`);
            }
            return res.json({"message":"Result Table", data: [result.rows]});
        }
    );
});

//ADD  Result record
app.post('/results', async (req: Request, res: Response) => {
  const { error, value } = createResultSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  const { student_id,maths, physic, chemistry, total_marks, exam_type } = value;
  const query = {
    text: 'INSERT INTO result (student_id, maths, physic, chemistry, total_marks, exam_type) VALUES ($1, $2, $3, $4, $5,$6)',
    values: [student_id, maths, physic, chemistry, total_marks, exam_type],
  };
  try {
    await pool.query(query);
    res.status(201).send({"message":`Result Table student id ${student_id} Added`, data: [{ student_id, maths, physic, chemistry, total_marks, exam_type}]});
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Database error' });
  }
});


// Update result record 
app.put('/results/:student_id', (req: Request, res: Response) => {
  const studentId = req.params.student_id;
  const { maths, physic, chemistry, total_marks, exam_type } = req.body;

  pool.query(
    'UPDATE result SET  maths = $1, physic = $2, chemistry = $3, total_marks = $4, exam_type = $5 WHERE student_id = $6',
    [maths, physic, chemistry,total_marks,exam_type,studentId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating student record');
      }

      pool.query(
        'UPDATE student SET students_id = $1 WHERE students_id = $2',
        [studentId, studentId],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error updating result record');
          }
          const updatedRow = {maths, physic, chemistry, total_marks, exam_type };
          return res.send({"message":`Result Table student id ${studentId} Updated`, data:[updatedRow]});
        }
      );
    }
  );
});

// Delete result record
app.delete('/results/:student_id', (req: Request, res: Response) => {
  const id = req.params.student_id;
  const { maths, physic, chemistry, total_marks, exam_type } = req.body;
  pool.query(
      'DELETE FROM result WHERE student_id = $1',
      [id],
      (err: any, result: any) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error deleting result record');
          }
          if (result.rowCount === 0) {
              return res.status(404).send(`No result record found with ID: ${id}`);
          }
          const deletedRow = {maths, physic, chemistry, total_marks, exam_type };
          return res.json({"message":`Result Table row id ${id} Deleted`, data: [deletedRow]});
      }
  );
});



app.listen(4003, () => {
console.log("server run on 4003");
});
