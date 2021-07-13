const {Client} = require('pg');

const pg_client = new Client({
    user: 'zpsetzdqkbkshh',
    host: 'ec2-34-193-101-0.compute-1.amazonaws.com',
    database: 'd6fuerdk4ff1sr',
    password: '38ce2dbeabb340c14f505b5833e64286b914dbeb0ddf80275c21455320b1233d',
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
