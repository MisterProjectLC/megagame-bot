var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_influence", 
    description: "check_influence: mostra todos os comandos de influências deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT * FROM logs, jogadores 
        WHERE logs.nome = 'influence' AND logs.jogador = jogadores.jogador_id ORDER BY args`).then((result) => {
            let response = "Influências: " + "\n";
            result.rows.forEach((row) => {
                response += row.time_nome + ": " + row.args.split('§').join(', ') + "\n";
            });
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
