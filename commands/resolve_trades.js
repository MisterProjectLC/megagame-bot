var db = require('../external/database.js');
var change_loyalty = require('./loyalty_action.js').change_loyalty;

// Exports
module.exports = {
    name: "resolve_trades", 
    description: "resolve_trades: resolve todos os comandos de troca deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM trocas WHERE confirmado = true ORDER BY ofertante`).then((result) => {
            let rows = result.rows;
            // Cada troca
            rows.forEach((row) => {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 FROM grupos WHERE grupos.nome = $2 AND grupos.tesoureiro = jogadores.cargo`,
                            [row.meconomia, row.ofertado]);
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 FROM grupos WHERE grupos.nome = $2 AND grupos.tesoureiro = jogadores.cargo`,
                            [row.seconomia, row.ofertante]);
                db.makeQuery(`UPDATE grupos SET recursos = recursos + (3 * $1) WHERE grupos.nome = $2 AND EXISTS (SELECT * FROM nações WHERE nome = $2)`,
                            [row.mcommodities, row.ofertado]);
                db.makeQuery(`UPDATE grupos SET recursos = recursos + (3 * $1) WHERE grupos.nome = $2 AND EXISTS (SELECT * FROM nações WHERE nome = $2)`,
                            [row.scommodities, row.ofertante]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE grupos.nome = $2 AND NOT EXISTS (SELECT * FROM nações WHERE nome = $2)`,
                            [row.mcommodities, row.ofertado]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE grupos.nome = $2 AND NOT EXISTS (SELECT * FROM nações WHERE nome = $2)`,
                            [row.scommodities, row.ofertante]);
                change_loyalty(row.ofertante, row.ofertado, 1);
                change_loyalty(row.ofertado, row.ofertante, 1);
            });
            db.makeQuery(`DELETE FROM trocas WHERE 1 = 1`);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
