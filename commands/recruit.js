var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "recruit", 
    description: "recruit <território> [qtd]: recruta tropas (tanto terrestres quanto maritimas)", 
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        // Tropas válidas
        let tropas = 1;
        if (com_args.length >= 2) {
            tropas = parseInt(com_args[1]);
            if (tropas !== tropas || tropas <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        } else
            com_args.push(tropas);

        // Território existe?
        let result = await db.makeQuery(`SELECT nome FROM territórios WHERE nome = '$1'`, [com_args[0]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }

        com_args.push(result.rows[0].isterrestre);
        log.logCommand(msg, " recruta " + tropas + " tropas em " + com_args[0] + ".", 
                        "recruit", com_args, tropas);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Militar") && phase == 1,
    command: (com_args) => {
        if (com_args[2])
            db.makeQuery(`UPDATE terrestres SET tropas = tropas + $1 WHERE nome = $2`, [com_args[1], com_args[0]]);
        //else
            //db.makeQuery(`UPDATE territórios SET tropas = tropas + $1 WHERE nome = $2`, [com_args[1], com_args[0]]);
    }
};
