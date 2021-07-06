var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_trades", 
    description: "check_trades: mostra todas os comandos de troca deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT time_nome, args FROM logs, jogadores
        WHERE logs.nome = 'trade' AND jogadores.jogador_id = logs.jogador`).then((result) => {
            let rows = result.rows;
            let alreadyChecked = [];
            let response = "Trocas:\n";
            // Cada troca
            for (let i = 0; i < rows.length; i++) {
                if (alreadyChecked.indexOf(rows[i].args) != -1)
                    continue;
                let i_args = rows[i].args.split('§');

                // Testando validade e adicionais da troca
                let ourOffer = i_args[1];
                let theirOffer = '';
                for (let j = i+1; j < rows.length; j++) {
                    if (alreadyChecked.indexOf(rows[j].args) != -1)
                        continue;

                    let j_args = rows[j].args.split('§');
                    // Adicionais do mesmo lado
                    if (rows[j].time_nome == rows[i].time_nome && i_args[0] == j_args[0]) {
                        ourOffer += " | " + j_args[1];
                        alreadyChecked.push(rows[j].args);
                    }
                    // Oferta do outro lado
                    else if (rows[j].time_nome == i_args[0] && rows[i].time_nome == j_args[0]) {
                        theirOffer += j_args[1] + " | ";
                        alreadyChecked.push(rows[j].args);
                    }
                }

                if (theirOffer != '')
                    response += rows[i].time_nome + ": " + ourOffer + " EM TROCA DE " + i_args[0] + ": " + theirOffer + "\n";
            }

            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
