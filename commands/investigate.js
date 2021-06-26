var args_invalidos = require('../data/errors.js').args_invalidos;
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
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar" || role.name == "Turing Testers" || role.name == "O Bobo"
                                                            || role.name == "Movimento de Restauração Ambiental" || role.name == "Global News Network"),
    command: (com_args) => {
        
    }
};
