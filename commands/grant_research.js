var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "grant_research", 
    description: "grant_research <especializações> <área> <publicador> <nação>: dá especialização do publicador para a nação.", 
    min: 4, max: 4,
    execute: async (com_args, msg) => {
        // Check args
        if (areas.indexOf(com_args[1]) == -1) {
            msg.reply("Área inválida!");
            return;
        }

        let esps = com_args[1].split(', ');
        esps.forEach((esp) => {
            db.makeQuery(`INSERT INTO pesquisas VALUES ($1, $2, $3)`, [com_args[0], esp, com_args[3]]);
        })

        db.makeQuery(`UPDATE opiniões SET valor = valor + 1 WHERE sujeito = $2 AND objeto = $1`,
                        [com_args[2], com_args[3]]).then(() => msg.reply("Dado."), () => msg.reply(args_invalidos));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
