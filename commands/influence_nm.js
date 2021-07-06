var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');
var influence = require('./influence.js').execute;

// Exports
module.exports = {
    name: "influence_nm", 
    description: "influence_nm <território> <slot(1/2)> <Naga/Mitsu>: coloca influência Naga ou Mitsu no slot escolhido.", 
    min: 3, max: 3,
    execute: async (com_args, msg) => {
        if (com_args[2] == 'Naga' || com_args[2] == 'Mitsu')
            influence(com_args, msg, this.name);
        else
            msg.reply(args_invalidos);
    },
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Nagamitsu") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`UPDATE terrestres SET influência` + com_args[1] + ` = $1 WHERE nome = $2`, [com_args[2], com_args[0]]);
    }
};
