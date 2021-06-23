var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "research", 
    description: "research <especialização>: faz pesquisa PURA em uma especialização", 
    execute: (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "pesquisa " + com_args[0] + ".", "research", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Pesquisador" || role.name == "Espectador"),
    command: (com_args, author_id) => {
        db.makeQuery(`INSERT INTO pesquisas SELECT $1, '', jogadores.time_nome FROM jogadores WHERE jogadores.jogador_id = $2`,
                            [com_args[0], author_id]);
    }
};
