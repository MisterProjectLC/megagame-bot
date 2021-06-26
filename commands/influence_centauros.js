var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "influence_centauros", 
    description: "influence_centauros <território> <slot(1/2)>: coloca influência Centauros no slot escolhido.", 
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 3) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa slot
        let slot = parseInt(com_args[1]);
        if (slot !== slot || slot <= 0 || slot >= 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa se território existe
        let kill = false;
        await db.makeQuery('SELECT * FROM territórios WHERE nome = $1', [com_args[1]]).then((response) => {
            if (response.rows.length < 1)
                kill = true;
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "influencia o slot " + slot + " de " + com_args[0] + ".", "influence", com_args);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Imperador") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`UPDATE terrestres SET influência` + com_args[1] + ` = 'Império dos Centauros' WHERE nome = $1`, [com_args[0]]);
    }
};
