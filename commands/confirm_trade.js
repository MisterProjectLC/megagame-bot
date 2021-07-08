var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "confirm_trade", 
    description: "confirm_trade <grupo>: confirma a oferta do grupo escolhido. AVISO: Depois de confirmada, você NÃO pode cancelá-la!",  
    min: 2, max: 2,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`UPDATE trocas SET confirmado = true WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $2) AND
        ofertado = $1`, [msg.author.id, com_args[0]]).then(async (response) => {
            if (response.rowCount <= 0) {
                msg.reply(args_invalidos);
                return;
            }

            let rows = response.rows;

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
            let recursos = autor_dados.recursos;
            if (!(autor_dados.nome == 'Nagamitsu' || autor_dados.receita == 'Imposto'))
                recursos /= 2; 

            if (rows.seconomia <= recursos)
                db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2`, [rows.seconomia, msg.author.id]);
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

            msg.reply("Confirmada.");
            await db.makeQuery('SELECT canal FROM jogadores WHERE cargo = (SELECT tesoureiro FROM grupos WHERE nome = $1)', [row.ofertante]).then((response) => {
                send_message(response.rows[0].canal, "A troca com " + row.ofertado + " foi confirmada.");
            });
        
        }, () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || 
                                                                            role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
