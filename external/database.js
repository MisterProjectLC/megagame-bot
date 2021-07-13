const {Client} = require('pg');

const pg_client = new Client({
    user: '***REMOVED***',
    host: '***REMOVED***',
    database: '***REMOVED***',
    password: '***REMOVED***',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

async function connectDB() {
    await pg_client.connect();
    console.log("DB conectado");
}

async function insertPlayer(id, name, team, role) {  
    await pg_client.query(`INSERT INTO jogadores (jogador_id, username, time_nome, cargo) VALUES ($1, $2, $3, $4);`, [id, name, team, role]);
    return 0;
}

async function getPlayer(id) {
    return await pg_client.query(`SELECT * FROM jogadores WHERE $1 = jogador_id`, [id]);
}

async function makeQuery(query, values) {
    return await pg_client.query(query, values);
}

module.exports.connectDB = connectDB;
module.exports.insertPlayer = insertPlayer;
module.exports.getPlayer = getPlayer;
module.exports.makeQuery = makeQuery;
