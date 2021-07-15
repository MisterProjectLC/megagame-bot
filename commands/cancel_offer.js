var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "cancel_offer", 
    description: `cancel_offer <grupo>: cancela a oferta com o grupo selecionado.`,
    min: 1, max: 1,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`SELECT * FROM trocas WHERE (ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND ofertado = $2)
        OR (ofertado = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND ofertante = $2)`, 
        [msg.author.id, com_args[0]]).then(async (response) => {
            if (response.rowCount <= 0) {
                msg.reply(args_invalidos);
                return;
            }

            // Reembolso
            let rows = response.rows;
            rows.forEach((row) => {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $2)
                AND EXISTS (SELECT * FROM grupos, nações WHERE grupos.nome = nações.nome AND grupos.tesoureiro = jogadores.cargo)`, 
                [parseInt(row.meconomia), row.ofertante]);
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + 2*$1 WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $2) 
                AND NOT EXISTS (SELECT * FROM grupos, nações WHERE grupos.nome = nações.nome AND grupos.tesoureiro = jogadores.cargo)`, 
                [parseInt(row.meconomia), row.ofertante]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE nome = $2`, [parseInt(row.mcommodities), row.ofertante]);

                if (row.confirmado) {
                    db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $2)
                AND EXISTS (SELECT * FROM grupos, nações WHERE grupos.nome = nações.nome AND grupos.tesoureiro = jogadores.cargo)`, 
                [parseInt(row.seconomia), row.ofertado]);
                    db.makeQuery(`UPDATE jogadores SET recursos = recursos + 2*$1 WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $2) 
                AND NOT EXISTS (SELECT * FROM grupos, nações WHERE grupos.nome = nações.nome AND grupos.tesoureiro = jogadores.cargo)`, 
                [parseInt(row.seconomia), row.ofertado]);
                    db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE nome = $2`, [parseInt(row.scommodities), row.ofertado]);
                }
            });


            // Deletar
            db.makeQuery(`DELETE FROM trocas WHERE ofertante = $1 AND ofertado = $2`, [row.ofertante, row.ofertado]);

            db.makeQuery('SELECT canal FROM jogadores WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $1)', [row.ofertado]).then((response) => {
                send_message(response.rows[0].canal, "A troca com " + row.ofertante + " foi cancelada.");
            });

            db.makeQuery('SELECT canal FROM jogadores WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $1)', [row.ofertante]).then((response) => {
                send_message(response.rows[0].canal, "A troca com " + row.ofertado + " foi cancelada.");
            });
        },
        
        () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
