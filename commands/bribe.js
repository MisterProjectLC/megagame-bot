var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./showlog.js');

// Exports
module.exports = {
    name: "bribe", 
    description: "bribe <amount>: gasta Economia para melhorar a Lealdade.", 
    execute: (com_args, msg) => {
        // Args
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        // Check if NaN
        let amount = parseInt(com_args[0]);
        if (amount !== amount || amount <= 0) {
            msg.reply(args_invalidos);
            return;
        }
        
        msg.reply("Comando enviado.");
        log.logCommand(msg, "gastou " + com_args[0] + " com suborno.", "bribe", com_args, (com_args) => {

        }, amount);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Líder de Estado")
};
