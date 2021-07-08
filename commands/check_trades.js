var db = require('../external/database.js');
var formatOffer = require('./offer.js').formatOffer;

// Exports
module.exports = {
    name: "check_trades", 
    description: "check_trades: mostra todas as suas trocas deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT * FROM trocas WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)
                            AND ofertado = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)`, [msg.author.id]).then((result) => {
            let rows = result.rows;
            let response = "Trocas:\n";
            // Cada troca
            rows.forEach((row) => {
                response += formatOffer(row.ofertante, row.meconomia, row.mcommodities, row.metc, row.seconomia, row.scommodities, row.setc);
            });

            msg.reply(response);
        });
    },
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
