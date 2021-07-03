var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "produce_commodities", 
    description: "produce_commodities <qtd>: produz commodities na quantidade especificada.", 
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        // Checa qtd
        let comms = parseInt(com_args[0]);
        if (comms !== comms || comms <= 0) {
            msg.reply(args_invalidos);
            return;
        }

        log.logCommand(msg, "produz " + comms + " commodities.", "produce_commodities", com_args, comms*2);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Nano Inc.") && phase == 1,
    command: (com_args, msg) => {
        db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE nome = (SELECT time_nome FROM jogadores WHERE jogador_id = $2)`, 
                    [com_args[0], msg.author.id]);
    }
};
