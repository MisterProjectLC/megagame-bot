var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./showlog.js');

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
        }

        // Território existe?
        let result = await db.makeQuery(`SELECT nome FROM territórios WHERE nome = '${com_args[0]}'`);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        
        msg.reply("Comando enviado.");
        log.logCommand(msg, " recruta " + tropas + " tropas em " + com_args[0] + ".", 
        "recruit", com_args, (com_args) => {
            db.makeQuery(`UPDATE territórios SET tropas = tropas + $1 WHERE nome = $2`, [tropas, com_args[0]]);
        }, tropas);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar")
};
