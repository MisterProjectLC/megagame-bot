var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "confirm_trade", 
    description: "confirm_trade <grupo>: confirma a oferta do grupo escolhido.",  
    min: 2, max: 2,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`UPDATE trocas SET confirmado = true WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) AND
        ofertado = $2`, [msg.author.id, com_args[0]]).then((response) => {
            msg.reply("Confirmada.");
        });
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
