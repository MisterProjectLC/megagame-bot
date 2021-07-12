var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;
const message_break = require('../utils/message_break.js').message_break;

// Exports
module.exports = {
    name: "check_research", 
    description: "check_research: mostra as especializações e tecnologias da sua nação.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT nome, descrição FROM pesquisas, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = pesquisas.grupo ORDER BY descrição`,
        [msg.author.id]).then((result) => {
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
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Pesquisador"  || role.name == "Espectador")
};
