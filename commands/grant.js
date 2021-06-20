var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "grant", 
    description: "grant <pessoa> <quantia>: aloca recursos para a pessoa.", 
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 2 || !msg.mentions.users.first()) {
            msg.reply(args_invalidos);
            return;
        }

        // Checar quantia
        let dinheiro = 1;
        if (com_args.length >= 2) {
            dinheiro = parseInt(com_args[1]);
            if (dinheiro !== dinheiro || dinheiro <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        }
        
        log.logCommand(msg, "aloca " + dinheiro + " recursos para " + com_args[0] + ".", 
                        "grant", com_args, dinheiro);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado"),
    command: (com_args) => {
        db.makeQuery(`UPDATE jogadores
        SET recursos = recursos + $1
        WHERE jogador_id = $2;`,
        [dinheiro, msg.mentions.users.first().id]).then(() => 
            msg.reply("Pago."));
    }
};
