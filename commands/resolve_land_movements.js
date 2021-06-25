var db = require('../external/database.js');

// Exports
module.exports = {
    name: "resolve_land_movements", 
    description: "resolve_land_movements: resolve todos os movimentos e combates terrestres.",
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT * FROM movimentos, territórios 
        WHERE destino = territórios.nome AND isterrestre = true ORDER BY destino`).then((result) => {
            let rows = result.rows;
            for (let i = 0; i < rows.length; i++) {

            }
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
