var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_commodities", 
    description: "check_commodities: mostra a quantidade de commodities da sua nação/facção.", 
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT commodities
        FROM grupos, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = grupos.nome`, [msg.author.id]).then((result) => {
            let response = "Commodities: " + result.rows[0].commodities;
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção")
};
