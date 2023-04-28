"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
});
client.query("CREATE DATABASE user", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' created database');
    client.end();
});
client.connect();
//# sourceMappingURL=connection.js.map