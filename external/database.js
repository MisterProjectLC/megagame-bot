const {Client} = require('pg');

const pg_client = new Client({
    user: process.env.DB_USER || 'zpsetzdqkbkshh',
    host: process.env.DB_HOST || 'ec2-34-193-101-0.compute-1.amazonaws.com',
    database: process.env.DB_DATABASE || 'd6fuerdk4ff1sr',
    password: process.env.DB_PASSWORD || '38ce2dbeabb340c14f505b5833e64286b914dbeb0ddf80275c21455320b1233d',
    port: process.env.PORT || 5432,
    ssl: { rejectUnauthorized: false }
});

async function connectDB() {
    await pg_client.connect();
    console.log("DB conectado");
}

async function insertPlayer(id, name, team, role) {
    console.log(id, name, team, role);
    await pg_client.query(`INSERT INTO jogadores (player_id, player_username, team_name, role_name) VALUES ('${id}', '${name}', '${team}', '${role}');`);
    return 0;
}

async function getPlayer(id) {
    return await pg_client.query(`SELECT * FROM jogadores WHERE '${id}' = player_id`);
}

module.exports.connectDB = connectDB;
module.exports.insertPlayer = insertPlayer;
module.exports.getPlayer = getPlayer;
