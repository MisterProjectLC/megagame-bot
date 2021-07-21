var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "custom", 
    description: "custom <ordem> [custo]: faz um comando especial. Serve para ordens que não encaixam em nenhum outro comando. Se custo não for dado, assume 1.", 
    min: 1, max: 2,
    execute: (com_args, msg) => {
        let custo = 1;
        if (com_args.length >= 2) {
            let i = parseInt(com_args[1]);
            if  (i !== i) {
                msg.reply(args_invalidos);
                return;
            } else
                custo = i;
        }
        log.logCommand(msg, com_args[0], "custom", com_args, custo);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};