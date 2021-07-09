var db = require('../external/database.js');

// Exports
module.exports = {
    name: "clear_trades", 
    description: "clear_trades: limpa todas as trocas do jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        db.makeQuery(`DELETE FROM trocas WHERE 1 = 1`);
        msg.reply("Limpo.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
