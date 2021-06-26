var db = require('../external/database.js');

const invasão = (território, nação, forças) => {
    // Attacked gets angry
    db.makeQuery(`UPDATE opiniões SET valor = valor - 2 
    WHERE sujeito = (SELECT nação FROM terrestres WHERE nome = $1) AND objeto = $2`, [território, nação]);
    db.makeQuery(`UPDATE nações SET lealdade = lealdade - 2 
    WHERE nome = (SELECT nação FROM terrestres WHERE nome = $1)`, [território]);

    // Attacker reacts
    db.makeQuery(`UPDATE nações SET lealdade = lealdade - 2*
    (SELECT valor FROM opiniões WHERE sujeito = (SELECT nação FROM terrestres WHERE nome = $1) AND objeto = $2)
    WHERE nome = (SELECT nação FROM terrestres WHERE nome = $1)`, [território, nação]);

    // Others react
    db.makeQuery(`UPDATE opiniões SET valor = valor - 1
    WHERE objeto = $2 AND sujeito <> (SELECT nação FROM terrestres WHERE nome = $1)
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = (SELECT nação FROM terrestres WHERE nome = $1)
    AND op.valor > 0)`, 
    [território, nação]);

    db.makeQuery(`UPDATE opiniões SET valor = valor + 1
    WHERE objeto = $2 AND sujeito <> (SELECT nação FROM terrestres WHERE nome = $1)
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = (SELECT nação FROM terrestres WHERE nome = $1)
    AND op.valor < 0)
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = $2 AND op.valor >= 0)`, 
    [território, nação]);

    // Invasão
    db.makeQuery(`UPDATE terrestres SET nação = $1, tropas = $2 WHERE nome = $3`, [nação, forças, território]);
}

// Exports
module.exports = {
    name: "resolve_land_movements", 
    description: "resolve_land_movements: resolve todos os movimentos e combates terrestres.",
    execute: async (com_args, msg) => {
        // Only movement
        await db.makeQuery(`SELECT forças, destino FROM movimentos
        WHERE movimentos.destino = terrestres.nome AND movimentos.nação = terrestres.nação`).then((result) => {
            let rows = result.rows;
            rows.forEach((row) => {
                db.makeQuery(`UPDATE terrestres SET tropas = tropas + $1 WHERE nome = $2`, [row.forças, row.destino]);
            })
        });


        // Attacks
        await db.makeQuery(`SELECT * FROM movimentos, terrestres
        WHERE movimentos.destino = terrestres.nome AND movimentos.nação <> terrestres.nação
        ORDER BY destino`).then((result) => {
            let rows = result.rows;

            // Each battle
            for (let i = 0; i < rows.length; i++) {
                let biggestArmy = i;
                let j = i+1;
                // Finding the biggest army
                while (rows[j].destino == rows[i].destino) {
                    if (rows[biggestArmy].forças < rows[i].forças)
                        biggestArmy = j;
                    j++;
                }

                let invasoresRestantes = rows[biggestArmy].forças - rows[biggestArmy].tropas;
                if (invasoresRestantes > 0) {
                    invasão(rows[biggestArmy].destino, rows[biggestArmy].nação, invasoresRestantes);
                } else {
                    db.makeQuery(`UPDATE terrestres SET tropas = $1 WHERE nome = $2`, [-invasoresRestantes, território]);
                }
                i = j-1;
            }

            db.makeQuery('DELETE FROM movimentos WHERE 1 = 1');
        });

        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
