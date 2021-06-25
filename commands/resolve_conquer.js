var db = require('../external/database.js');

async (com_args, msg) => {
    await db.makeQuery(`SELECT * FROM logs, jogadores 
    WHERE logs.nome = 'influence' AND logs.jogador = jogadores.jogador_id ORDER BY args`).then((result) => {
        
    });
}


// Exports
module.exports = {
    name: "resolve_conquer", 
    description: "resolve_conquer <território> <nova_nação> <novas_tropas>: resolve uma conquista de território.",
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM logs, jogadores 
        WHERE logs.nome = 'influence' AND logs.jogador = jogadores.jogador_id ORDER BY args`).then((result) => {
            
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
