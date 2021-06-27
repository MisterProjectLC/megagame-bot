var db = require('../external/database.js');

const reações = (território, atacante) => {
    let multiplicador = 1;

    // Attacked gets angry
    db.makeQuery(`UPDATE opiniões SET valor = valor - $3 
    WHERE sujeito = (SELECT nação FROM terrestres WHERE nome = $1) AND 
    objeto = (SELECT time_nome FROM jogadores WHERE jogador_id = $2)`, [território, atacante, multiplicador]);
    
    db.makeQuery(`UPDATE nações SET lealdade = lealdade - $2
    WHERE nome = (SELECT nação FROM terrestres WHERE nome = $1)`, [território, multiplicador]);

    // Attacker reacts
    db.makeQuery(`UPDATE nações SET lealdade = lealdade - $3*
    (SELECT valor FROM opiniões WHERE sujeito = (SELECT time_nome FROM jogadores WHERE jogador_id = $2) 
    AND objeto = (SELECT nação FROM terrestres WHERE nome = $1))
    WHERE nome = (SELECT time_nome FROM jogadores WHERE jogador_id = $2)`, [território, atacante, multiplicador]);
}


// Exports
module.exports = {
    name: "resolve_sea_movements", 
    description: "resolve_sea_movements: resolve todos os movimentos e combates marítimos.",
    execute: async (com_args, msg) => {
        // Only movement
        await db.makeQuery(`SELECT forças, destino, movimentos.nação FROM movimentos, frotas
        WHERE origem ILIKE 'O%' AND movimentos.origem = frotas.território AND 
        NOT isHostil(movimentos.nação, movimentos.destino)`).then((result) => {
            let rows = result.rows;
            rows.forEach((row) => {
                db.makeQuery(`INSERT INTO frotas VALUES ($1, $2, $3)`, [row.destino, row.nação, row.forças]);
            })
        });


        // Attacks
        await db.makeQuery(`SELECT forças, tamanho, destino, movimentos.nação FROM movimentos, frotas
        WHERE origem ILIKE 'O%' AND movimentos.origem = frotas.território AND 
        isHostil(movimentos.nação, movimentos.destino) ORDER BY destino`).then((result) => {
            let rows = result.rows;

            // Each attack
            for (let i = 0; i < rows.length; i++)
                reações(rows[i].destino, rows[i].nação)

            // Each battle
            for (let i = 0; i < rows.length; i++) {
                let biggestArmy = i;
                let secondBiggest = null;
                // Finding the biggest army
                let j = i+1;
                while (j < rows.length && rows[j].destino == rows[i].destino) {
                    if (rows[biggestArmy].forças < rows[i].forças) {
                        secondBiggest = biggestArmy;
                        biggestArmy = j;
                    }
                    j++;
                }

                // Resolve combat
                let invasoresRestantes = rows[biggestArmy].forças - rows[biggestArmy].tamanho;
                if (invasoresRestantes > 0) {   // Win attack
                    if (secondBiggest != null && rows[biggestArmy].tamanho < rows[secondBiggest].forças)
                        invasoresRestantes = rows[biggestArmy].forças - rows[secondBiggest].forças;
                    db.makeQuery(`INSERT INTO frotas VALUES ($1, $2, $3)`, [rows[biggestArmy].destino, rows[biggestArmy].nação, invasoresRestantes]);
                
                } else  // Win defense
                    db.makeQuery(`UPDATE frotas SET tamanho = $1 WHERE território = $2`, [-invasoresRestantes, território]);
                i = j-1;
            }

            db.makeQuery(`DELETE FROM movimentos WHERE origem ILIKE 'O%'`);
        });

        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
