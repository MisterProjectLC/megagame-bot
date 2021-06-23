var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "trade", 
    description: "trade <grupo> <troca>: avisa sobre uma troca com um grupo.", 
    execute: async (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        let kill = false;
        await db.makeQuery("SELECT * FROM grupos WHERE nome = $1", [com_args[2]]).then((response) => {
            let thisGrupo = response.rows[0];
            if (!thisGrupo) {
                msg.reply("Nação não encontrada.");
                kill = true;
            }
        })
        if (kill)
            return;
        
        log.logCommand(msg, "anuncia troca com " + com_args[0] + ": " + com_args[1], "research", com_args, 0);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
