var db = require('../external/database.js');

// Exports
module.exports = {
    name: "clear_log", 
    description: "clear_log: limpa todos os logs do jogo.", 
    execute: async (com_args, msg) => {
        // Terra
        await db.makeQuery(`DELETE FROM logs WHERE comando != ''`).then(() => {
            msg.reply("Limpo.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
