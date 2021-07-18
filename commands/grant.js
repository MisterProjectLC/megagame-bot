var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "grant", 
    description: "grant <cargo> <quantia>: aloca recursos para a pessoa com o cargo especificado.", 
    min: 2, max: 2,
    execute: async (com_args, msg) => {
        // Checar quantia
        let dinheiro = 1;
        if (com_args.length >= 2) {
            dinheiro = parseInt(com_args[1]);
            if (dinheiro !== dinheiro || dinheiro <= 0) {    // is NaN
                msg.reply(args_invalidos);
                return;
            }
        }

        let banco = 0, kill = false;
        await db.makeQuery(`SELECT recursos FROM jogadores WHERE jogador_id = $1;`, [msg.author.id]).then((response) => {
            if (!response.rows[0] || response.rows[0].recursos < dinheiro) {
                kill = true;
                return;
            }
        });
        if (kill) {
            msg.reply("Recursos insuficientes!");
            return;
        }
        
        db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo ILIKE $2;`, [dinheiro, com_args[0]]).then((res) => {
            if (res.rowCount == 1) {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2;`, [dinheiro, msg.author.id]);
                msg.reply("Pago com sucesso.");
            } else
                msg.reply(args_invalidos);
        });
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado")
};
