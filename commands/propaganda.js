var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "propaganda", 
    description: "propaganda <grupo> <delta>: gasta Economia para modificar a OP da nação em relação ao grupo-alvo.", 
    min: 2, max: 2, 
    execute: async (com_args, msg) => {
        // Alvo
        let kill = false;
        await db.makeQuery("SELECT * FROM grupos WHERE nome = $1", [com_args[0]]).then((response) => {
            let thisGrupo = response.rows[0];
            if (!thisGrupo) {
                msg.reply("Grupo não encontrado.");
                kill = true;
            }
        })
        if (kill)
            return;

        // Delta
        let delta = parseInt(com_args[1]);
        if (delta !== delta) {
            msg.reply(args_invalidos);
            return;
        }
        
        log.logCommand(msg, "mudou OP com " + com_args[0] + " em " + com_args[1], "propaganda", com_args, Math.abs(delta));
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`UPDATE opiniões SET valor = valor + $1 WHERE sujeito = (SELECT time_nome FROM jogadores WHERE jogador_id = $2) AND
                    objeto = $3`, [com_args[1], author_id, com_args[0]]);
    }
};
