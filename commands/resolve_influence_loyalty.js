var db = require('../external/database.js');

// Exports
module.exports = {
    name: "resolve_influence_loyalty", 
    description: "resolve_influence_loyalty: modifica a lealdade de todos as nações baseada nas OPs das facções presentes em seu território.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM opiniões, terrestres WHERE opiniões.sujeito = terrestres.nação 
        AND (opiniões.objeto = terrestres.influência1 OR opiniões.objeto = terrestres.influência2)`).then((result) => {
            let delta = {};
            result.rows.forEach((row) => {
                if (delta[row.nação])
                    delta[row.nação] += row.valor/2;
                else
                    delta[row.nação] = row.valor/2;
            });

            for (let nation in delta) {
                db.makeQuery(`UPDATE nações SET lealdade = lealdade + $1 WHERE nações.nome = $2`, [Math.floor(delta[nation]), nation]);
            }
        });

        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
