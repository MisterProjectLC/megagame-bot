var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "treaty", 
    description: "treaty <nação>: assina tratado PARA ESTE TURNO de fronteiras abertas com nação escolhida. Apenas ocorre caso ambos os lados tiverem assinado.", 
    min: 1, max: 1, 
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        let kill = false;
        await db.makeQuery("SELECT * FROM nações WHERE nome = $1", [com_args[0]]).then((response) => {
            let thisGrupo = response.rows[0];
            if (!thisGrupo) {
                msg.reply("Nação não encontrada.");
                kill = true;
            }
        })
        if (kill)
            return;
        
        log.logCommand(msg, "anuncia tratado de fronteiras com " + com_args[0] + ".", "treaty", com_args, 0);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 0,
    command: (com_args) => {
        
    }
};
