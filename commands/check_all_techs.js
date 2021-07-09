var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;
const message_break = require('../utils/message_break.js').message_break;

// Exports
module.exports = {
    name: "check_all_techs", 
    description: "check_all_techs: mostra todas as techs do jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT nome, grupo, descrição FROM pesquisas ORDER BY descrição`).then((result) => {
            let response = [];
            result.rows.forEach((row) => {
                if (areas.indexOf(row.descrição) == -1)
                    response.push(row.grupo + " - " + row.nome + ": " + row.descrição + "\n");
            });

            message_break(response, "Tech não encontrada.").forEach((message) => msg.reply(message));
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
