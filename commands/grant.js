var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "grant", 
    description: "grant <pessoa> <quantia>: aloca recursos para a pessoa.", 
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checar quantia
        let dinheiro = 1;
        if (com_args.length >= 2) {
            dinheiro = parseInt(com_args[1]);
            if (dinheiro !== dinheiro || dinheiro <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        }
        
        log.logCommand(msg, "aloca " + dinheiro + " recursos para " + com_args[0] + ".", "grant", com_args, dinheiro);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 0,
    command: (com_args) => {
        db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = $2;`,
        [dinheiro, com_args[0]]).then(() => msg.reply("Pago."));
    }
};
