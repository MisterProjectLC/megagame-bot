var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_commodities_mod", 
    description: "check_commodities_mod <grupo>: mostra a quantidade de commodities do grupo.", 
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT commodities FROM grupos WHERE nome ILIKE $1`, [com_args[0]]).then((result) => {
            if (result.rows[0]) {
                let response = "Commodities: " + result.rows[0].commodities;
                msg.reply(response);
            }
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
