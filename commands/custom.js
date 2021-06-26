var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "custom", 
    description: "custom <ordem>: faz um comando especial. Serve para ordens que não encaixam em nenhum outro comando", 
    execute: (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }
        log.logCommand(msg, com_args[0], "custom", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};