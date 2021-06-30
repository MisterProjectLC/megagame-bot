var db = require('../external/database.js');
import * as areas from '../data/research_areas.json';

// Exports
module.exports = {
    name: "check_research", 
    description: "check_research: mostra as especializações e tecnologias da sua nação.", 
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT nome, descrição
        FROM pesquisas, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = pesquisas.grupo`, 
        [msg.author.id]).then((result) => {
            let response = "";
            result.rows.forEach((row) => {
                if (row.descrição in areas)
                    response += "Especialização - " + row.nome + ", Área: " + row.descrição + "\n";
                else
                    response += "Tecnologia - " + row.nome + ": " + row.descrição + "\n";
            });

            
            if (response == '')
                msg.reply('nenhuma pesquisa encontrada.')
            else
                msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Pesquisador")
};
