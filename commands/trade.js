var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "trade", 
    description: "trade <grupo> <troca>: avisa sobre sua parte de uma troca com um grupo.",  
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        let kill = false;
        await db.makeQuery("SELECT * FROM grupos WHERE nome = $1", [com_args[0]]).then((response) => {
            let thisGrupo = response.rows[0];
            if (!thisGrupo) {
                msg.reply("Nação não encontrada.");
                kill = true;
            }
        })
        if (kill)
            return;
        
        log.logCommand(msg, "anuncia troca com " + com_args[0] + ": " + com_args[1], "trade", com_args, 0);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || 
    role.name == "Chefe de Facção" || role.name == "Espectador") && phase == 1,
    command: (com_args) => {
        
    }
};
