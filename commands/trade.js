var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "trade", 
    description: "trade <grupo> <troca>: avisa sobre sua parte de uma troca com um grupo. AVISO: assim que você enviar o comando, o outro grupo receberá uma mensagem sobre sua oferta.",  
    min: 2, max: 2,
    execute: async (com_args, msg, send_message) => {
        
        let autor_dados = await db.makeQuery("SELECT * FROM jogadores WHERE jogador_id = $1", [msg.author.id]).rows[0];

        let kill = false;
        await db.makeQuery("SELECT * FROM grupos, jogadores WHERE nome = $1 AND grupos.tesoureiro = jogadores.cargo", [com_args[0]]).then((response) => {
            let alvo = response.rows[0];
            if (!alvo) {
                msg.reply("Nação não encontrada.");
                kill = true;
            } else
                send_message(alvo.canal, "Oferta de " + autor_dados.time_nome + " recebida: " + com_args[1]);
        })
        if (kill)
            return;
        
        log.logCommand(msg, "anuncia troca com " + com_args[0] + ": " + com_args[1], "trade", com_args, 0);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || 
    role.name == "Chefe de Facção" || role.name == "Espectador") && phase == 1,
    command: (com_args) => {
        
    }
};
