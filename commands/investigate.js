var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "investigate", 
    description: "investigate <alvo> <tipo-espionagem>: investiga alvo com a técnica dada.", 
    execute: (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "investiga " + com_args[0] + " com o método " + com_args[1] + ".", "investigate", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar"),
    command: (com_args) => {
        
    }
};