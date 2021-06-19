var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "give", 
    description: "give <person> <amount>: dá recursos para a pessoa.", 
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
        
        db.makeQuery(`UPDATE jogadores
        SET recursos = recursos + $1
        WHERE jogador_id = $2;`,
        [com_args[1], msg.mentions.users.first().id]).then(() => 
            msg.reply("Pago."));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
