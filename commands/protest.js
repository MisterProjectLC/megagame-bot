var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "protest", 
    description: "protest <nação> <delta>: muda a lealdade da nação em delta. 1 Influência = 1 Lealdade mudada.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        // Check amount to give
        let delta = parseInt(com_args[1]);
        if (delta !== delta) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa alvo
        let result = await db.makeQuery(`SELECT nome FROM grupos WHERE grupos.nome ILIKE $1`, [com_args[0]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, " protesta em " + com_args[0] + ", mudando sua Lealdade em " + com_args[1] + ".", "protest", com_args, abs(delta));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Restauração Ambiental"),
    command: (com_args, msg) => {
        db.makeQuery(`UPDATE nações SET lealdade = lealdade + $1 WHERE nome ILIKE $2;`, [com_args[1], com_args[0]]);
    }
};
