var db = require('../external/database.js');

// Exports
module.exports = {
    name: "clear_movements", 
    description: "clear_movements: limpa todos os movimentos do jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Terra
        await db.makeQuery(`DELETE FROM movimentos WHERE destino != ''`).then(() => {
            msg.reply("Limpo.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
