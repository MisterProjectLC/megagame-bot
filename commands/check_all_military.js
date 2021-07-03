var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_all_military", 
    description: "check_all_military: mostra todas as tropas e frotas no jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT * FROM nações`).then((result) => {
            let response = "Esquadrões:\n";
            result.rows.forEach((row) => {
                response += row.nome + ": " + row.aéreas + "\n";
            });

            msg.reply(response);
        });

        // Terra
        await db.makeQuery(`SELECT * FROM terrestres ORDER BY nome`).then((result) => {
            let response = "Terrestres:\n";
            result.rows.forEach((row) => {
                response += row.nome + ": " + row.tropas + " de " + row.nação + "\n";
            });

            msg.reply(response);
        });

        // Mar
        await db.makeQuery(`SELECT * FROM frotas ORDER BY nação`).then((result) => {
            let response = "Frotas:\n";
            result.rows.forEach((row) => {
                response += row.território + ": " + row.tamanho + " de " + row.nação + "\n";
            });

            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
