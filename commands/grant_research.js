var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "grant_research", 
    description: "grant_research <especializações> <área> <publicador> <nações>: dá especializações do publicador para as nações.", 
    min: 4, max: 4,
    execute: async (com_args, msg) => {
        // Check args
        if (areas.indexOf(com_args[1]) == -1) {
            msg.reply("Área inválida!");
            return;
        }

        let nações = com_args[3].split(', ');
        let esps = com_args[0].split(', ');
        nações.forEach((nação) => {
            esps.forEach((esp) => {
                db.makeQuery(`INSERT INTO pesquisas VALUES ($1, $2, $3)`, [esp, com_args[1], nação]);
            })

            db.makeQuery(`UPDATE opiniões SET valor = valor + 1 WHERE sujeito = $2 AND objeto = $1`,
                            [com_args[2], nação]).then(() => msg.reply("Dado para " + nação + "."), () => msg.reply(args_invalidos));
        })
        
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
