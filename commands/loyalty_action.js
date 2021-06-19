var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "loyalty_action", 
    description: "loyalty_action <nação> <grupo> [multiplicador]: aplica uma ação de lealdade.", 
    execute: (com_args, msg) => {
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checar se multiplicador é válido
        let multiplier = 1;
        if (com_args.length >= 3) {
            let i = parseInt(com_args[2]);
            console.log(i);
            if  (i !== i) { // is NaN
                msg.reply(args_invalidos);
                return;
            }
            multiplier = i;
        }

        // Obtém opinião
        db.makeQuery("SELECT * FROM opiniões WHERE sujeito = $1 AND objeto = $2", [com_args[0], com_args[1]]).then(response => {
            if (!response.rows[0]) {
                msg.reply(args_invalidos);
                return;
            }
            let delta = multiplier*parseInt(response.rows[0].valor);
            db.makeQuery(`UPDATE nações
                        SET lealdade = lealdade + $1
                        WHERE nome = $2;`, [delta, com_args[0]]).then(() => 
                msg.reply("Feito."));
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
