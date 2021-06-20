var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "influence", 
    description: "influence <território> <slot(1/2)>: coloca sua influência no slot escolhido.", 
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa slot
        let slot = parseInt(com_args[2]);
        if (slot !== slot || slot <= 0 || slot >= 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa se território existe
        let kill = false;
        await db.makeQuery('SELECT * FROM territórios WHERE nome = $1', [com_args[0]]).then((response) => {
            if (response.rows.length < 1)
                kill = true;
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "influencia o slot " + slot + " de " + com_args[0] + ".", 
                        "influence", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Facção"),
    command: (com_args) => {
        
    }
};
