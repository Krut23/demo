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
const dotenv_1 = __importDefault(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./postgresql/table.ts");
require("./postgresql/insert.ts");
dotenv_1.default.config({ path: './config.env' });
const app = express_1.default();
app.use(body_parser_1.default.json());
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
console.log("PG_CONNECTION_STRING: ", connectionString);
const pool = new pg_1.Pool({
    connectionString
});
pool.connect();
const createStudentSchema = joi_1.default.object({
    students_id: joi_1.default.number().required(),
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    birthdate: joi_1.default.date().required(),
    gender: joi_1.default.string().valid('Male', 'Female', 'Other').required(),
});
const createResultSchema = joi_1.default.object({
    student_id: joi_1.default.number().required(),
    maths: joi_1.default.number().required(),
    physic: joi_1.default.number().required(),
    chemistry: joi_1.default.number().required(),
    total_marks: joi_1.default.number().required(),
    exam_type: joi_1.default.string().valid('midterm', 'final').required(),
});
app.get('/students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query('SELECT * FROM student');
        res.json({ "message": "Student Table", data: [result.rows] });
    }
    finally {
        client.release();
    }
}));
app.get('/students/:students_id', (req, res) => {
    const studentId = req.params.students_id;
    pool.query('SELECT * FROM student WHERE students_id = $1', [studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching result records');
        }
        if (result.rows.length === 0) {
            return res.status(404).send(`No student records found for student with ID: ${studentId}`);
        }
        return res.json({ "message": "Student Table", data: [result.rows] });
    });
});
app.post('/students', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield pool.query(query);
        res.status(201).send({ "message": `Student Table student id ${students_id} Added`, data: [{ students_id, name, email, birthdate, gender }] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Database error' });
    }
}));
app.put('/students/:students_id', (req, res) => {
    const studentId = req.params.students_id;
    const { name, email, birthdate, gender } = req.body;
    pool.query('UPDATE student SET name = $1, email = $2, birthdate = $3, gender = $4 WHERE students_id = $5', [name, email, birthdate, gender, studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating student record');
        }
        pool.query('UPDATE result SET student_id = $1 WHERE student_id = $2', [studentId, studentId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating result record');
            }
            const updatedRow = { name, email, birthdate, gender };
            return res.send({ "message": `Student Table student id ${studentId} Updated`, data: [updatedRow] });
        });
    });
});
app.delete('/students/:students_id', (req, res) => {
    const studentId = req.params.students_id;
    const { name, email, birthdate, gender } = req.body;
    pool.query('DELETE FROM result WHERE student_id = $1', [studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting student record');
        }
        pool.query('DELETE FROM student WHERE students_id = $1', [studentId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error deleting student record');
            }
            const deletedRow = { name, email, birthdate, gender };
            return res.send({ "message": `Student Table student id ${studentId} Deleted`, data: [deletedRow] });
        });
    });
});
app.get('/results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        const result = yield client.query('SELECT * FROM result');
        res.json({ "message": "Result Table", data: [result.rows] });
    }
    finally {
        client.release();
    }
}));
app.get('/results/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    pool.query('SELECT * FROM result WHERE student_id = $1', [studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching result records');
        }
        if (result.rows.length === 0) {
            return res.status(404).send(`No result records found for student with ID: ${studentId}`);
        }
        return res.json({ "message": "Result Table", data: [result.rows] });
    });
});
app.post('/results', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = createResultSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const { student_id, maths, physic, chemistry, total_marks, exam_type } = value;
    const query = {
        text: 'INSERT INTO result (student_id, maths, physic, chemistry, total_marks, exam_type) VALUES ($1, $2, $3, $4, $5,$6)',
        values: [student_id, maths, physic, chemistry, total_marks, exam_type],
    };
    try {
        yield pool.query(query);
        res.status(201).send({ "message": `Result Table student id ${student_id} Added`, data: [{ student_id, maths, physic, chemistry, total_marks, exam_type }] });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Database error' });
    }
}));
app.put('/results/:student_id', (req, res) => {
    const studentId = req.params.student_id;
    const { maths, physic, chemistry, total_marks, exam_type } = req.body;
    pool.query('UPDATE result SET  maths = $1, physic = $2, chemistry = $3, total_marks = $4, exam_type = $5 WHERE student_id = $6', [maths, physic, chemistry, total_marks, exam_type, studentId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating student record');
        }
        pool.query('UPDATE student SET students_id = $1 WHERE students_id = $2', [studentId, studentId], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating result record');
            }
            const updatedRow = { maths, physic, chemistry, total_marks, exam_type };
            return res.send({ "message": `Result Table student id ${studentId} Updated`, data: [updatedRow] });
        });
    });
});
app.delete('/results/:student_id', (req, res) => {
    const id = req.params.student_id;
    const { maths, physic, chemistry, total_marks, exam_type } = req.body;
    pool.query('DELETE FROM result WHERE student_id = $1', [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting result record');
        }
        if (result.rowCount === 0) {
            return res.status(404).send(`No result record found with ID: ${id}`);
        }
        const deletedRow = { maths, physic, chemistry, total_marks, exam_type };
        return res.json({ "message": `Result Table row id ${id} Deleted`, data: [deletedRow] });
    });
});
app.listen(4003, () => {
    console.log("server run on 4003");
});
//# sourceMappingURL=app.js.map