var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "propaganda", 
    description: "propaganda <alvo> <delta>: gasta Economia para modificar a OP da nação em relação ao alvo.", 
    execute: (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        let delta = parseInt(com_args[0]);
        if (delta !== delta) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "mudou OP com " + com_args[0] + " em " + com_args[1], 
                        "propaganda", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado"),
    command: (com_args) => {
        
    }
};