var db = require('../external/database.js');

// Exports
module.exports = {
    name: "resolve_treaties", 
    description: "resolve_treaties: gera os tratados para este turno.",
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT time_nome, args FROM logs, jogadores
        WHERE logs.nome = 'treaty' AND jogadores.jogador_id = logs.jogador`).then((result) => {
            let rows = result.rows;
            let alreadyRegistered = [];
            // Cada tratado
            for (let i = 0; i < rows.length; i++) {
                if (alreadyRegistered.indexOf(rows[i].time_nome + rows[i].args) != -1)
                    continue;
                // Procurar tratado do outro lado
                for (let j = i+1; j < rows.length; j++) {
                    if (rows[j].time_nome == rows[i].args) {
                        db.makeQuery(`INSERT INTO tratados_fronteiras VALUES ($1, $2)`, [rows[i].time_nome, rows[j].time_nome]);
                        alreadyRegistered.push(rows[i].time_nome + rows[i].args);
                    }
                }
            }

            msg.reply("Resolvido.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
