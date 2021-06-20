var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./show_log.js');

// Exports
module.exports = {
    name: "move", 
    description: "move <origem> <destino> [qtd]: move tropas (tanto terrestres quanto maritimas)", 
    execute: (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }
        let tropas = 1;
        if (com_args.length >= 3) {
            tropas = parseInt(com_args[2]);
            if (tropas !== tropas || tropas <= 0) {
                msg.reply(args_invalidos);
                return;
            }
        }
        
        log.logCommand(msg, "move " + tropas + " tropas de " + com_args[0] + " para " + com_args[1] + ".", 
                        "move", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar"),
    command: (com_args) => {
            
    }
};
