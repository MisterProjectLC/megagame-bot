var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_movements", 
    description: "check_movements: mostra todas os movimentos no jogo.", 
    execute: async (com_args, msg) => {
        // Terra
        await db.makeQuery(`SELECT * FROM movimentos ORDER BY destino`).then((result) => {
            let response = "";
            result.rows.forEach((row) => {
                response += row.origem + "-- " + row.forças + " --> " + row.destino + "\n";
            });

            if (response == "")
                msg.reply("nenhum movimento.");
            else
                msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
