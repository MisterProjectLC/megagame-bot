var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "give_loyalty", 
    description: "give_loyalty <nação> <qtd>: dá lealdade para a nação.", 
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 2 || !msg.mentions.users.first()) {
            msg.reply(args_invalidos);
            return;
        }

        // Check amount to give
        let i = parseInt(com_args[1]);
        if (i !== i) {
            msg.reply(args_invalidos);
            return;
        }
        
        db.makeQuery(`UPDATE nações
        SET lealdade = lealdade + $1
        WHERE nome = $2;`,
        [com_args[1], com_args[0]]).then(() => 
            msg.reply("Pago."));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
