var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_ruins", 
    description: "check_ruins: mostra a quantidade de ruínas da sua nação/facção.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT ruínas
        FROM grupos, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = grupos.nome`, [msg.author.id]).then((result) => {
            let response = "Ruínas: " + result.rows[0].ruínas;
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Pesquisador")
};
