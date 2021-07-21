var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "confirm_trade", 
    description: "confirm_trade <grupo>: confirma a oferta do grupo escolhido.",  
    min: 1, max: 1,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`SELECT * FROM trocas WHERE ofertado = (SELECT grupos.nome FROM grupos, jogadores 
        WHERE grupos.tesoureiro = jogadores.cargo AND jogador_id = $1) AND ofertante ILIKE $2`, [msg.author.id, com_args[0]]).then(async (response) => {
            if (response.rows.length <= 0) {
                msg.reply(args_invalidos);
                return;
            }
            let rows = response.rows[0];

            // Consegue dados do autor
            let autor_dados = null;
            await db.makeQuery("SELECT * FROM jogadores, grupos WHERE jogador_id = $1 AND grupos.nome = jogadores.time_nome",
            [msg.author.id]).then((responser) => {
                if (responser.rows[0])
                    autor_dados = responser.rows[0];
            });
            if (autor_dados === null)
                return;

            // Gastar recursos
            let gastos = parseInt(rows.seconomia);
            if (!(autor_dados.nome == 'Nagamitsu' || autor_dados.receita == 'Imposto'))
                gastos *= 2;

            if (gastos <= autor_dados.recursos)
                db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2`, [gastos, msg.author.id]);
            else {
                msg.reply("Fundos insuficientes!");
                return;
            }

            if (rows.scommodities <= autor_dados.commodities)
                db.makeQuery(`UPDATE grupos SET commodities = commodities - $1 WHERE nome = $2`, [rows.scommodities, autor_dados.nome]);
            else {
                msg.reply("Commodities insuficientes!");
                return;
            }

            db.makeQuery(`UPDATE trocas SET confirmado = true WHERE ofertado = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND ofertante = $2`, [msg.author.id, com_args[0]]);
            msg.reply("Confirmada.");
            await db.makeQuery('SELECT canal FROM jogadores WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $1)', [rows.ofertante]).then((response) => {
                send_message(response.rows[0].canal, "A troca com " + rows.ofertado + " foi confirmada.");
            });
        
        }, () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || 
                                                                            role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
