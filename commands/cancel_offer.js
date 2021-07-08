var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "cancel_offer", 
    description: `cancel_offer <grupo>: cancela todas as ofertas com o grupo selecionado.`,
    min: 1, max: 1,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`SELECT * FROM trocas WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND
        ofertado = $2`, [msg.author.id, com_args[0]]).then((response) => {
            if (response.rowCount <= 0) {
                msg.reply(args_invalidos);
                return;
            }

            // Reembolso
            let rows = response.rows;
            rows.forEach((row) => {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE jogador_id = $2`, [parseInt(row.meconomia), msg.author.id]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE nome = $2`, [parseInt(row.mcommodities), row.nome]);
            });

            // Deletar
            db.makeQuery(`DELETE FROM trocas WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND ofertado = $2`);

            msg.reply("Deletada(s).");
        },
        
        () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};