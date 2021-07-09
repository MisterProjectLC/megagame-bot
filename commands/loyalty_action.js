var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

var change_loyalty = (nação, grupo, multiplicador) => {
    // Obtém opinião
    db.makeQuery("SELECT * FROM opiniões WHERE sujeito = $1 AND objeto = $2", [nação, grupo]).then(response => {
        if (!response.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }
        let delta = multiplicador*parseInt(response.rows[0].valor);
        db.makeQuery(`UPDATE nações
                    SET lealdade = lealdade + $1
                    WHERE nome = $2;`, [delta, nação]).then(() => 
            msg.reply("Feito."));
    });
}

// Exports
module.exports = {
    name: "loyalty_action", 
    description: "loyalty_action <nação> <grupo> [multiplicador]: aplica uma ação de lealdade da nação contra o grupo.", 
    min: 2, max: 3,
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
        change_loyalty(com_args[0], com_args[1], multiplier);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador"),
    change_loyalty: change_loyalty
};
