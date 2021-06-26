var db = require('../external/database.js');

const invasão = (território, nação, forças) => {
    // Attacked gets angry
    db.makeQuery(`UPDATE opiniões SET valor = valor - 1 
    WHERE sujeito = (SELECT nação FROM terrestres WHERE nome = $1) AND objeto = $2`, [território, nação]);
    db.makeQuery(`UPDATE nações SET lealdade = lealdade - 1 
    WHERE nome = (SELECT nação FROM terrestres WHERE nome = $1)`, [território]);

    // Attacker reacts
    db.makeQuery(`UPDATE nações SET lealdade = lealdade -
    (SELECT valor FROM opiniões WHERE sujeito = (SELECT nação FROM terrestres WHERE nome = $1) AND objeto = $2)
    WHERE nome = (SELECT nação FROM terrestres WHERE nome = $1)`, [território, nação]);

    // Invasão
    db.makeQuery(`INSERT INTO frotas VALUES ($1, $2, $3)`, [território, nação, forças]);
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
        await db.makeQuery(`SELECT forças, destino, movimentos.nação FROM movimentos, frotas
        WHERE origem ILIKE 'O%' AND movimentos.origem = frotas.território AND 
        isHostil(movimentos.nação, movimentos.destino) ORDER BY destino`).then((result) => {
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

                let invasoresRestantes = rows[biggestArmy].forças - rows[biggestArmy].tamanho;
                if (invasoresRestantes > 0) {
                    invasão(rows[biggestArmy].destino, rows[biggestArmy].nação, invasoresRestantes);
                } else {
                    db.makeQuery(`UPDATE frotas SET tamanho = $1 WHERE território = $2`, [-invasoresRestantes, território]);
                }
                i = j-1;
            }

            db.makeQuery('DELETE FROM movimentos WHERE 1 = 1');
        });

        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
