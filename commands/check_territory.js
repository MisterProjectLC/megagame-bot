var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_territory", 
    description: "check_territory <território>: mostra a lista de territórios adjacentes do alvo.", 
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        await db.makeQuery(`SELECT * FROM adjacentes WHERE terA ILIKE $1 ORDER BY terA`, [com_args[0]]).then((result) => {
            let response = "Adjacentes: ";
            result.rows.forEach((row) => {
                response += row.terb + " ";
            });
            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Militar")
};
