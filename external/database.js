const {Client} = require('pg');

const pg_client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.PORT || 5432,
});

async function connectDB() {
    await pg_client.connect();
}

async function insertPlayer(id, name, team, role) {
    await pg_client.query(`INSERT INTO jogadores VALUES(${id}, ${name}, ${team}, ${role})`);
}

async function getPlayer(id) {
    return await pg_client.query(`SELECT * FROM jogadores WHERE ${id} = player_id`);
}

module.exports.connectDB = connectDB;
module.exports.insertPlayer = insertPlayer;
module.exports.getPlayer = getPlayer;
