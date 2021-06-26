var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "unregister", 
    description: "unregister <título>: remove um jogador.", 
    execute: (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }
        
        db.makeQuery(`DELETE FROM jogadores WHERE cargo = $1;`, com_args).then(() => msg.reply("Removido."), () => msg.reply(args_invalidos));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
