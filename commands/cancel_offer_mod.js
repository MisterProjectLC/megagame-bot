var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "cancel_offer_mod", 
    description: `cancel_offer_mod <ofertante> <ofertado>: deleta a troca.`,
    min: 2, max: 2,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`DELETE FROM trocas WHERE ofertante ILIKE $1 AND ofertado ILIKE $2`, [...com_args]).then((response) => {
            if (response.rowCount <= 0) {
                msg.reply(args_invalidos);
                return;
            }

            msg.reply("Deletada.");
        },
        
        () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Moderador"),
    command: (com_args) => {
        
    }
};
