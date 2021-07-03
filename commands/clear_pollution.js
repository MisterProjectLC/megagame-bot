var db = require('../external/database.js');

// Exports
module.exports = {
    name: "clear_pollution", 
    description: "clear_pollution: limpa a poluição de todos os territórios.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Terra
        await db.makeQuery(`UPDATE terrestres SET poluição = false WHERE 1 = 1`).then(() => {
            msg.reply("Limpo.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
