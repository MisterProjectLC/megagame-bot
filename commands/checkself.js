var db = require('../external/database.js');

// Exports
module.exports = {
    name: "checkself", 
    description: "checkself: teste debug haaaa", 
    execute: async (com_args, msg) => {
        await db.getPlayer(msg.author.id).then((response) => {
            console.log(response.rows[0]);
            msg.reply(response.rows[0].player_username + ": " + response.rows[0].team_name + ", " + response.rows[0].role_name);
        });
    }, 
    permission: (msg) => true
};
