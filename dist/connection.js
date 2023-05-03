"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const connectionString = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}`;
console.log("PG_CONNECTION_STRING: ", connectionString);
const client = new pg_1.Client({
    connectionString
});
client.connect();
const schema = joi_1.default.object({
    databaseName: joi_1.default.string().required(),
});
const requestData = {
    databaseName: 'mydatabase1',
};
const validationResult = schema.validate(requestData);
if (validationResult.error) {
    console.error(validationResult.error);
    process.exit(1);
}
client.query(`CREATE DATABASE ${requestData.databaseName}`, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('created database');
    client.end();
});
//# sourceMappingURL=connection.js.map