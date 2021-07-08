var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

let formatOffer = (outroTime, mEconomia, mCommo, mEtc, sEconomia, sCommo, sEtc) => {
    return "Oferta de " + outroTime + " recebida:\n " + 
    "Eles oferecem: " + mEconomia + " economia, " + mCommo + " commodities e " + mEtc + ".\n" + 
    "Eles querem: " + sEconomia + " economia, " + sCommo + " commodities e " + sEtc + ".\n";
}


// Exports
module.exports = {
    name: "offer", 
    description: `offer <grupo> <minhaEconomia> <minhasCommodities> <minhasEtc> <suaEconomia> <suasCommodities> <suasEtc>: oferece uma troca. Se já houver uma troca com grupo fornecido, substitui-a. Os primeiros 3 argumentos são sobre sua parte da troca, os outros 3 são da outra parte. AVISO: Ao enviar o comando, um aviso é feito no canal do outro lado.
    Exemplo: >offer "Consórcio Magnus" 5 2 "" 0 1 "Território M2"`,
    min: 7, max: 7,
    execute: async (com_args, msg, send_message) => {
        // Consegue dados do autor
        let autor_dados = null;
        await db.makeQuery("SELECT * FROM jogadores, grupos WHERE jogador_id = $1 AND grupos.nome = jogadores.time_nome", 
        [msg.author.id]).then((response) => {
            if (response.rows[0])
                autor_dados = response.rows[0];
        });
        if (autor_dados === null)
            return;

        // Checar se nação existe
        let kill = false;
        let alvo = "";
        await db.makeQuery("SELECT * FROM grupos, jogadores WHERE grupos.nome = $1 AND grupos.tesoureiro = jogadores.cargo", 
                            [com_args[0]]).then((response) => {
            alvo = response.rows[0];
            if (!alvo) {
                msg.reply("Nação não encontrada.");
                kill = true;
            }
        });
        if (kill)
            return;
        
        // Checar valores numéricos
        let delta = 1;
        let argsNumericos = [1, 2, 4, 5];
        for (let j = 0; j < argsNumericos.length; j++) {
            let i = parseInt(com_args[argsNumericos[j]]);
            if  (i !== i) {
                msg.reply(args_invalidos);
                return;
            }
        }

        // Gastar recursos
        let recursos = autor_dados.recursos;
        if (!(autor_dados.nome == 'Nagamitsu' || autor_dados.receita == 'Imposto'))
            recursos /= 2; 

        if (parseInt(com_args[1]) <= recursos)
            db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2`, [parseInt(com_args[1]), msg.author.id]);
        else {
            msg.reply("Fundos insuficientes!");
            return;
        }

        if (parseInt(com_args[2]) <= autor_dados.commodities)
            db.makeQuery(`UPDATE grupos SET commodities = commodities - $1 WHERE nome = $2`, [parseInt(com_args[2]), autor_dados.nome]);
        else {
            msg.reply("Commodities insuficientes!");
            return;
        }

        // Checar detalhes
        if (com_args[3] == "")
            com_args[3] = "só";
                        
        if (com_args[6] == "")
            com_args[6] = "só";

        // Caso já exista, substitui
        await db.makeQuery("DELETE FROM trocas WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1), ofertado = $2",
                            [msg.author.id, com_args[0]]);
        await db.makeQuery(`INSERT INTO trocas VALUES ((SELECT time_nome FROM jogadores WHERE jogador_id = $1), $2, $3, $4, $5, $6, %7, %8)`, 
        [msg.author.id, ...com_args]).then(() => {
            send_message(alvo.canal, formatOffer(autor_dados.time_nome, com_args[1], com_args[2],
                        com_args[3], com_args[4], com_args[5], com_args[6]));
        });
        
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado" || role.name == "Chefe de Facção" || 
                                                            role.name == "Espectador"),
    command: (com_args) => {
        
    }
};
