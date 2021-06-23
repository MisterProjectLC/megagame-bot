var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "operation", 
    description: "operation <alvo> <descrição>: lança operação contra alvo.", 
    execute: (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "lança operação contra " + com_args[0] + ". Descrição: " + com_args[1] + ".", "operation", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
