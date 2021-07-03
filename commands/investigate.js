var args_invalidos = require('../data/errors.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "investigate", 
    description: "investigate <alvo> <tipo-espionagem>: investiga alvo (cargo de jogador OU nome de grupo) com a técnica dada.",
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa alvo
        let result = await db.makeQuery(`SELECT time_nome FROM jogadores, grupos WHERE jogadores.cargo = $1 OR grupos.nome = $1`, [com_args[0]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "investiga " + com_args[0] + " com o método " + com_args[1] + ".", "investigate", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar" || role.name == "Turing Tester" || role.name == "O Bobo"
                                                            || role.name == "Restauração Ambiental" || role.name == "Global News Network"),
    command: (com_args) => {
        
    }
};
