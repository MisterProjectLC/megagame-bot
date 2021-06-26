var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "give_research", 
    description: "give_research <especialização> [grupo]: dá especialização para o grupo (ou todos os grupos).", 
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        if (com_args.length < 2)
            db.makeQuery(`INSERT INTO pesquisas SELECT $1, '', grupos.nome FROM grupos`, 
            [com_args[0]]).then(() => msg.reply("Pago."), () => msg.reply(args_invalidos));
        else
            db.makeQuery(`INSERT INTO pesquisas VALUES ($1, '', $2)`,
            [com_args[0], com_args[1]]).then(() => msg.reply("Pago."), () => msg.reply(args_invalidos));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
