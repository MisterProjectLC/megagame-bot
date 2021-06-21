var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "develop", 
    description: `develop <tecnologia> <especializações> <explicação>: faz pesquisa APLICADA. Exemplo:
develop "Teoria dos Memes" "Virologia, Sociologia" "Teoria de como ideias se espalham como vírus. Com isso, posso influenciar 2 slots ao invés de 1."`, 
    execute: async (com_args, msg) => {
        if (com_args.length < 3) {
            msg.reply(args_invalidos);
            return;
        }
        
        await log.logCommand(msg, "desenvolve " + com_args[0] + ", usando " + com_args[1] + ". Explicação: " + com_args[2], "develop", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Pesquisador"),
    command: (com_args, author_id) => {
        db.makeQuery(`INSERT INTO pesquisas SELECT $1, $2, jogadores.time_nome FROM jogadores WHERE jogadores.jogador_id = $3`,
        [com_args[0], com_args[2], author_id]);
    }
};
