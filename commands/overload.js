var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "overload", 
    description: "overload <território>: sobrecarrega um território, causando poluição mas produzindo 1 Economia.", 
    execute: async (com_args, msg) => {
        // Check args
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa se território existe e não já está poluído
        let kill = false;
        await db.makeQuery('SELECT * FROM territórios WHERE nome = $1 AND poluição = false', [com_args[0]]).then((response) => {
            if (response.rows.length < 1)
                kill = true;
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "sobrecarrega " + com_args[0] + ".", "overload", com_args, -1);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 0,
    command: (com_args) => {
        db.makeQuery(`UPDATE territórios SET poluição = true WHERE nome = $1;`, [com_args[0]]);
    }
};
