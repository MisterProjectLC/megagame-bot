var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "cancel_influence", 
    description: "cancel_influence <território> <slot(1/2)>: cancela todas os logs de influência do slot.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        await db.makeQuery("DELETE FROM logs WHERE nome = 'influence' AND args ilike '" + com_args[0] + "§" + com_args[1] + "%'").then(() => {
            msg.reply('Cancelado(s).'); 
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
