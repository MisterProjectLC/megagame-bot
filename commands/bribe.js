var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "bribe", 
    description: "bribe <amount>: gasta Economia para melhorar a Lealdade.", 
    min: 1, max: 1, 
    execute: async (com_args, msg) => {
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
        
        await log.logCommand(msg, "gastou " + com_args[0] + " com suborno.", "bribe", com_args, amount);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 1,
    command: (com_args) => {
        console.log(com_args);
    }
};
