var db = require('../external/database.js');

const reações = (território, atacante) => {
    let multiplicador = 2;

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
    name: "resolve_land_movements", 
    description: "resolve_land_movements: resolve todos os movimentos e combates terrestres.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Only movement
        await db.makeQuery(`SELECT forças, destino, movimentos.nação FROM movimentos, terrestres
        WHERE movimentos.destino = terrestres.nome AND (movimentos.nação = terrestres.nação OR terrestres.nação IS NULL)`).then((result) => {
            let rows = result.rows;
            rows.forEach((row) => {
                db.makeQuery(`UPDATE terrestres SET tropas = tropas + $1, nação = $3 WHERE nome = $2`, [row.forças, row.destino, row.nação]);
            })
        });


        // Attacks
        await db.makeQuery(`SELECT movimentos.nação, tropas, forças, destino FROM movimentos, terrestres
        WHERE movimentos.destino = terrestres.nome AND terrestres.nação IS NOT NULL AND movimentos.nação <> terrestres.nação
        ORDER BY destino`).then((result) => {
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
                let invasoresRestantes = rows[biggestArmy].forças - rows[biggestArmy].tropas;
                if (invasoresRestantes > 0) {   // Win attack
                    if (secondBiggest != null && rows[biggestArmy].tropas < rows[secondBiggest].forças)
                        invasoresRestantes = rows[biggestArmy].forças - rows[secondBiggest].forças;
                    db.makeQuery(`UPDATE terrestres SET nação = $1, tropas = $2 WHERE nome = $3`, 
                                    [rows[biggestArmy].nação, invasoresRestantes, rows[biggestArmy].destino]);
                
                } else  // Win defense
                    db.makeQuery(`UPDATE terrestres SET tropas = $1 WHERE nome = $2`, [-invasoresRestantes, rows[biggestArmy].destino]);
                i = j-1;
            }

            db.makeQuery(`DELETE FROM movimentos WHERE origem NOT ILIKE 'O%'`);
        });

        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
