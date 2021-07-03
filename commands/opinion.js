var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "opinion", 
    description: `opinion <grupo> [delta] [juiz]: modifica a opinião de outros contra o grupo especificado.`, 
    min: 1, max: 3,
    execute: async (com_args, msg) => {
        let kill = false;
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        // Delta
        let delta = 1;
        if (com_args.length >= 2) {
            let i = parseInt(com_args[1]);
            if  (i !== i) {
                msg.reply(args_invalidos);
                return;
            } else
                delta = i;
        }

        // Juiz
        sql = "";
        values = [];
        if (com_args.length >= 3) {
            await db.makeQuery("SELECT * FROM nações WHERE nome = $1", [com_args[2]]).then((response) => {
                let thisGrupo = response.rows[0];
                if (!thisGrupo) {
                    msg.reply("Nação não encontrada.");
                    kill = true;
                }
                sql = "UPDATE opiniões SET valor = valor + $1 WHERE objeto = $2 AND sujeito = $3";
                values = [delta, com_args[0], com_args[2]];
            })
            if (kill)
                return;
        } else {
            sql = "UPDATE opiniões SET valor = valor + $1 WHERE objeto = $2";
            values = [delta, com_args[0]];
        }

        await db.makeQuery(sql, values);
        msg.reply("Comando enviado.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
