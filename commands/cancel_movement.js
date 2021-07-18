var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "cancel_movement", 
    description: `cancel_movement <origem> <destino>: deleta o movimento.`,
    min: 1, max: 1,
    execute: async (com_args, msg, send_message) => {
        await db.makeQuery(`DELETE FROM movimentos WHERE origem ILIKE $1 AND destino ILIKE $2`, [...com_args]).then((response) => {
            if (response.rowCount <= 0) {
                msg.reply(args_invalidos);
                return;
            }

            msg.reply("Deletado.");
        },
        
        () => msg.reply(args_invalidos));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
