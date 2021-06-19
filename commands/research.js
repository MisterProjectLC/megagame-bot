var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./showlog.js');

// Exports
module.exports = {
    name: "research", 
    description: "research <especialização>: faz pesquisa PURA em uma especialização", 
    execute: (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }
        
        msg.reply("Comando enviado.");
        log.logCommand(msg, "pesquisa " + com_args[0] + ".", "research", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Cientista")
};
