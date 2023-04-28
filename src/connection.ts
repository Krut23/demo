import { Client } from 'pg';


const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
});

client.query(
    "CREATE DATABASE user", (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(' created database');
        client.end();
})

client.connect();
