var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "give_research", 
    description: "give_research <especialização> <área> [grupo]: dá especialização para o grupo (ou todos os grupos).", 
    min: 2, max: 3,
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 2 || areas.indexOf(com_args[1]) == -1) {
            msg.reply(args_invalidos);
            return;
        }

        if (com_args.length < 3)
            db.makeQuery(`INSERT INTO pesquisas SELECT $1, $2, grupos.nome FROM grupos`, 
            [com_args[0], com_args[1]]).then(() => msg.reply("Dado."), () => msg.reply(args_invalidos));
        else
            db.makeQuery(`INSERT INTO pesquisas VALUES ($1, $2, $3)`,
            [com_args[0], com_args[1], com_args[2]]).then(() => msg.reply("Dado."), () => msg.reply(args_invalidos));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
