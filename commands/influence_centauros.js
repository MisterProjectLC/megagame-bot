var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');
var influence = require('./influence.js').execute;

// Exports
module.exports = {
    name: "influence_centauros", 
    description: "influence_centauros <território> <slot(1/2)>: coloca influência Centauros no slot escolhido.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        influence(com_args, msg, this.name);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Imperador") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`UPDATE terrestres SET influência` + com_args[1] + ` = 'Império dos Centauros' WHERE nome = $1`, [com_args[0]]);
    }
};
