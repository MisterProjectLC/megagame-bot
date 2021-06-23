var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_military", 
    description: "check_military: mostra todas as tropas, frotas e esquadrões da sua nação.", 
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT aéreas, time_nome FROM nações, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = nações.nome`, [msg.author.id]).then((result) => {
            let response = "Esquadrões: " + result.rows[0].aéreas + "\n";
            nação = result.rows[0].time_nome;
            msg.reply(response);
        });

        // Terra
        await db.makeQuery(`SELECT * FROM terrestres WHERE nação = $1 ORDER BY nome`, [nação]).then((result) => {
            let response = "Exércitos:\n";
            result.rows.forEach((row) => {
                response += row.nome + ": " + row.tropas + " tropas\n";
            });

            msg.reply(response);
        });

        // Mar
        db.makeQuery(`SELECT * FROM frotas WHERE nação = $1 ORDER BY nação`, [nação]).then((result) => {
            let response = "Frotas:\n";
            result.rows.forEach((row) => {
                response += row.território + ": " + row.tamanho + " frotas\n";
            });

            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
