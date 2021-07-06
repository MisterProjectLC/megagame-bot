var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "research", 
    description: "research <especialização> <área>: faz pesquisa PURA em uma especialização. A área pode ser Exatas, Biológicas ou Humanas.", 
    min: 2, max: 2, 
    execute: (com_args, msg) => {
        if (com_args.length < 2 || areas.indexOf(com_args[1]) == -1) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "pesquisa " + com_args[0] + " na área " + com_args[1] + ".", "research", com_args, 1);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Pesquisador" || role.name == "Espectador") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`INSERT INTO pesquisas SELECT $1, $2, jogadores.time_nome FROM jogadores WHERE jogadores.jogador_id = $3`,
                            [com_args[0], com_args[1], author_id]);
    }
};
