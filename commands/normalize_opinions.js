var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "normalize_opinions", 
    description: `normalize_opinions: faz alterações nas opiniões e nas lealdades para normalizá-las.`, 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        db.makeQuery(`UPDATE opiniões SET valor = valor - 1 WHERE valor > 2`);
        db.makeQuery(`UPDATE opiniões SET valor = valor + 1 WHERE valor < -3`);
        db.makeQuery(`UPDATE nações SET lealdade = lealdade - GREATEST(0, (lealdade-15)/5)`);
        msg.reply("Feito.")
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
