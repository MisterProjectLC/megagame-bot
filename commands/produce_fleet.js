var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "produce_fleet", 
    description: "produce_fleet <território> <nação> [qtd]: constrói frota no território especificado para a nação especificada na quantidade especificada.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        // Tropas válidas
        let frotas = 1;
        if (com_args.length >= 3) {
            frotas = parseInt(com_args[2]);
            if (frotas !== frotas || frotas <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        } else
            com_args.push(frotas);

        // Território existe?
        let result = await db.makeQuery(`SELECT nome FROM territórios WHERE nome ILIKE $1`, [com_args[0]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        com_args[0] = result.rows[0].nome;

        // Nação existe?
        result = await db.makeQuery(`SELECT nome FROM nações WHERE nome ILIKE $1`, [com_args[1]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        com_args[1] = result.rows[0].nome;

        log.logCommand(msg, " produz " + frotas + " frotas em " + com_args[0] + " para " + com_args[1] + ".", "produce_fleet", com_args, frotas);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Nano Inc.") && phase == 1,
    command: (com_args) => {
        db.makeQuery(`INSERT INTO frotas VALUES ($1, $2, $3)`, [com_args[0], com_args[1], tropas]);
    }
};
