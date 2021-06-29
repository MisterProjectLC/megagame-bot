var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_nation", 
    description: "check_nation: mostra a Lealdade e Opiniões Públicas da sua nação.", 
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT lealdade, time_nome, objeto, valor 
        FROM nações, opiniões, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = nações.nome AND nações.nome = opiniões.sujeito
        ORDER BY valor`, [msg.author.id]).then((result) => {
            let response = "Nação: " + result.rows[0].time_nome + "\nLealdade: " + result.rows[0].lealdade + "\nOpiniões Públicas:\n";
            result.rows.forEach((row) => {
                response += row.objeto + ": " + row.valor + "\n";
            });
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado")
};
