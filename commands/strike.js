var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "strike", 
    description: "strike <território>: faz um ataque aéreo contra o território",  
    min: 1, max: 1,
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        // Aviões disponíveis?
        let totalEsquadrões = null;
        let esquadrõesEnviados = null;

        const promise1 = db.makeQuery(`SELECT aéreas FROM nações 
        WHERE nome = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)`, [msg.author.id]).then((result) => {
            totalEsquadrões = parseInt(result.rows[0].aéreas);
        });

        const promise2 = db.makeQuery(`SELECT count(idade) AS enviados FROM logs
        WHERE nome = 'strike' AND jogador = $1 GROUP BY (jogador, idade)`, [msg.author.id]).then((result) => {
            if (result.rows[0])
                esquadrõesEnviados = parseInt(result.rows[0].enviados);
            else
                esquadrõesEnviados = 0;
        });

        await Promise.all([promise1, promise2]);
        console.log(totalEsquadrões, esquadrõesEnviados);
        if (totalEsquadrões - esquadrõesEnviados - 1 <= 0) {
            msg.reply("Não há esquadrões disponíveis.");
            return;
        }

        // Território existe?
        let result = await db.makeQuery(`SELECT nome FROM territórios WHERE nome = $1`, [com_args[0]]);
        if (!result.rows[0]) {
            msg.reply(args_invalidos);
            return;
        }

        log.logCommand(msg, "faz um ataque aéreo em " + com_args[0] + ".", "strike", com_args);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Militar") && phase == 1,
    command: (com_args) => {
        if (com_args[0])
            db.makeQuery(`UPDATE terrestres SET tropas = tropas - 1 WHERE nome = $1`, [com_args[0]]);
    }
};
