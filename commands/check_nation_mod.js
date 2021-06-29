var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_nation_mod", 
    description: "check_nation_mod <nação>: mostra a Lealdade e Opiniões Públicas da nação escolhida.", 
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        await db.makeQuery(`SELECT lealdade, objeto, valor, nome
        FROM nações, opiniões WHERE nações.nome = $1 AND nações.nome = opiniões.sujeito ORDER BY valor`, [com_args[0]]).then((result) => {
            let response = "Nação: " + result.rows[0].nome + "\nLealdade: " + result.rows[0].lealdade + "\nOpiniões Públicas:\n";
            result.rows.forEach((row) => {
                response += row.objeto + ": " + row.valor + "\n";
            });
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
