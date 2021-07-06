var db = require('../external/database.js');

// Exports
module.exports = {
    name: "clear_log", 
    description: "clear_log: limpa todos os logs do jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Terra
        await db.makeQuery(`SELECT * FROM logs`).then((result) => {
            for (let i = 0; i < result.rowCount; i++)
                db.makeQuery(`DELETE FROM logs WHERE ctid IN (SELECT ctid FROM logs ORDER BY prioridade, jogador, idade LIMIT 1)`);
            msg.reply("Limpo.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
