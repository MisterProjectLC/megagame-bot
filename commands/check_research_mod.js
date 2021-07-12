var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;
const message_break = require('../utils/message_break.js').message_break;

// Exports
module.exports = {
    name: "check_research_mod", 
    description: "check_research_mod <grupo>: mostra as especializações e tecnologias do grupo selecionado.", 
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT nome, descrição FROM pesquisas WHERE $1 = pesquisas.grupo ORDER BY descrição`, [com_args[0]]).then((result) => {
            let response = "";
            result.rows.forEach((row) => {
                if (areas.indexOf(row.descrição) != -1)
                    response += "Especialização - " + row.nome + ", Área: " + row.descrição + "\n";
                else
                    response += "Tecnologia - " + row.nome + ": " + row.descrição + "\n";
            });

            message_break(response, 'nenhuma pesquisa encontrada.').forEach((message) => msg.reply(message));
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
