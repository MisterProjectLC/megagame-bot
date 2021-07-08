var db = require('../external/database.js');
var formatOffer = require('./check_trades.js').formatOffer;

// Exports
module.exports = {
    name: "check_trades_mod", 
    description: "check_trades_mod: mostra todas os comandos de troca deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM trocas WHERE confirmado = true ORDER BY ofertante`, [msg.author.id]).then((result) => {
            let rows = result.rows;
            let response = "Trocas:\n";
            // Cada troca
            rows.forEach((row) => {
                response += formatOffer(row.ofertante, row.ofertado, row.meconomia, row.mcommodities, row.metc, row.seconomia, row.scommodities, row.setc);
            });

            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
