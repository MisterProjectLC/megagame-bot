var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_nation_mod", 
    description: "check_nation_mod <nação>: mostra a Lealdade e Opiniões Públicas da nação escolhida.",  
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT lealdade, objeto, valor, nações.nome
        FROM nações, opiniões WHERE nações.nome ILIKE $1 AND nações.nome = opiniões.sujeito ORDER BY valor`, [com_args[0]]).then((result) => {
            if (!result.rows[0])
                return;

            let response = "Nação: " + com_args[0] + "\nLealdade: " + result.rows[0].lealdade + "\nOpiniões Públicas:\n";
            result.rows.forEach((row) => {
                response += row.objeto + ": " + row.valor + "\n";
            });
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
