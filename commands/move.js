var db = require('../external/database.js');
var log = require('./showlog.js');

// Exports
module.exports = {
    name: "move", 
    description: "move <origem> <destino> [qtd]: move tropas (tanto terrestres quanto maritimas)", 
    execute: (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }
        let tropas = 1;
        if (com_args.length >= 3) {
            tropas = parseInt(com_args[2]);
            if (tropas == NaN) {
                msg.reply(args_invalidos);
                return;
            }
        }
        
        msg.reply("Comando enviado.");
        log.log_command(msg.author, "move " + tropas + " tropas de " + com_args[0] + " para " + com_args[1] + ".");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar")
};
