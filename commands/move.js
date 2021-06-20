var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "move", 
    description: "move <origem> <destino> [qtd]: move tropas (tanto terrestres quanto maritimas)", 
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa tropas
        let tropas = 1;
        if (com_args.length >= 3) {
            tropas = parseInt(com_args[2]);
            if (tropas !== tropas || tropas <= 0) {
                msg.reply(args_invalidos);
                return;
            }
        }

        // Checa se territórios existem
        let kill = false;
        await db.makeQuery('SELECT * FROM territórios WHERE nome = $1 OR nome = $2', [com_args[0], com_args[1]]).then((response) => {
            if (response.rows.length < 2)
                kill = true;
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "move " + tropas + " tropas de " + com_args[0] + " para " + com_args[1] + ".", 
                        "move", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar"),
    command: (com_args) => {
            
    }
};
