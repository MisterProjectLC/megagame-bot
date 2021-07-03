var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "produce_fleet", 
    description: "produce_fleet <nação> [qtd]: constrói esquadrões para a nação especificada na quantidade especificada.", 
    min: 1, max: 2,
    execute: async (com_args, msg) => {
        // Tropas válidas
        let esquadrões = 1;
        if (com_args.length >= 2) {
            esquadrões = parseInt(com_args[2]);
            if (esquadrões !== esquadrões || esquadrões <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        } else
            com_args.push(esquadrões);

        // Nação existe?
        result = await db.makeQuery(`SELECT nome FROM nações WHERE nome = $1`, [com_args[1]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }

        log.logCommand(msg, " produz " + esquadrões + " esquadrões para " + com_args[1] + ".", "produce_fleet", com_args, frotas);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Nano Inc.") && phase == 1,
    command: (com_args) => {
        db.makeQuery(`UPDATE nações SET aéreas = aéreas + $2 WHERE nome = $1`, [com_args[0], tropas]);
    }
};
