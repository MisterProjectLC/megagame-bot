var db = require('../external/database.js');

let formatOffer = (ofertante, ofertado, mEconomia, mCommo, mEtc, sEconomia, sCommo, sEtc) => {
    return "Oferta de " + ofertante + " para " + ofertado + ":\n " + 
    "Eles oferecem: " + mEconomia + " economia, " + mCommo + " commodities e " + mEtc + ".\n" + 
    "Eles querem: " + sEconomia + " economia, " + sCommo + " commodities e " + sEtc + ".\n";
}

// Exports
module.exports = {
    name: "check_trades", 
    description: "check_trades: mostra todas as suas trocas deste turno.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        // Ar
        let nação = '';
        await db.makeQuery(`SELECT * FROM trocas WHERE ofertante = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)
                            OR ofertado = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)`, [msg.author.id]).then((result) => {
            let rows = result.rows;
            let response = "Trocas:\n";
            // Cada troca
            rows.forEach((row) => {
                response += formatOffer(row.ofertante, row.ofertado, row.meconomia, row.mcommodities, row.metc, row.seconomia, row.scommodities, row.setc);
            });

            msg.reply(response);
        });
    },
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador"),
    formatOffer: formatOffer
};
