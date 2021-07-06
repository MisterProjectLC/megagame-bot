var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "recruit", 
    description: "recruit <território> [qtd]: recruta tropas (tanto terrestres quanto maritimas)", 
    min: 1, max: 2,
    execute: async (com_args, msg) => {
        // Tropas válidas
        let tropas = 1;
        if (com_args.length >= 2) {
            tropas = parseInt(com_args[1]);
            if (tropas !== tropas || tropas <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        } else
            com_args.push(tropas);

        // Território existe?
        let result = await db.makeQuery(`SELECT nome FROM territórios WHERE nome = $1 
                                    AND meuTerritório((SELECT time_nome FROM jogadores WHERE jogador_id = $2), $1)`, [com_args[0], msg.author.id]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }

        com_args.push(result.rows[0].isterrestre.toString());
        log.logCommand(msg, " recruta " + tropas + " tropas em " + com_args[0] + ".", 
                        "recruit", com_args, tropas);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Militar") && phase == 1,
    command: (com_args, author_id) => {
        if (com_args[2] == 'true')
            db.makeQuery(`UPDATE terrestres SET tropas = tropas + $1 WHERE nome = $2`, [com_args[1], com_args[0]]);
        else
            db.makeQuery(`INSERT INTO frotas VALUES ($1, (SELECT time_nome FROM jogadores WHERE jogador_id = $2), $3)`, 
                        [com_args[0], author_id, com_args[1]]);
    }
};