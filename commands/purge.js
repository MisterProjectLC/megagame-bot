var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "purge", 
    description: "purge <território> <slot(1/2)>: remove a influência do slot escolhido.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 2) {
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
        await db.makeQuery('SELECT * FROM territórios WHERE nome = $1', [com_args[0]]).then((response) => {
            if (response.rows.length < 1 || (slot == 1 && response.rows.influência1 === null) || (slot == 2 && response.rows.influência2 === null))
                kill = true;
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "remove a influência do slot " + slot + " de " + com_args[0] + ".", 
                        "purge", com_args);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 1,
    command: (com_args) => {
        db.makeQuery(`UPDATE terrestres SET influência` + com_args[1] + ` = NULL WHERE nome = $1`, [com_args[0]]);
    }
};
