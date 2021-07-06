var db = require('../external/database.js');

const distribuirRecursos = (rows) => {
    let delta = {};

    rows.forEach((row) => {
        if (!delta[row.nome])
            delta[row.nome] = [0, 0, 0];

        switch (row.recurso[0]) {
            case 'C':
                delta[row.nome][1] += 1;
                break;
            case 'R':
                delta[row.nome][2] += 1;
                break;
            default:
                delta[row.nome][0] += parseInt(row.recurso);
                break;
        }
    });

    return delta;
}

// Exports
module.exports = {
    name: "resolve_income", 
    description: "resolve_income: dá recursos para todos os grupos baseado em seus territórios/presença.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        const promise1 = db.makeQuery(`SELECT grupos.nome, recurso FROM grupos, terrestres 
        WHERE grupos.nome = terrestres.nação AND grupos.receita = 'Imposto'`).then((result) => {
            let delta = distribuirRecursos(result.rows);

            for (let nation in delta) {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = 
                        (SELECT tesoureiro FROM grupos WHERE grupos.nome = $2)`, [delta[nation][0], nation]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE grupos.nome = $2`, [delta[nation][1], nation]);
                db.makeQuery(`UPDATE grupos SET ruínas = $1 WHERE grupos.nome = $2`, [delta[nation][2], nation]);
            }
        });

        const promise2 = db.makeQuery(`SELECT grupos.nome, influência1, influência2 FROM grupos, terrestres 
        WHERE (grupos.nome = terrestres.influência1 OR grupos.nome = terrestres.influência2) AND grupos.receita = 'Influência'`).then((result) => {
            let delta = {};

            result.rows.forEach((row) => {
                if (!delta[row.nome])
                    delta[row.nome] = 0;
                
                delta[row.nome] += 1;
                if (row.influência1 == row.influência2)
                    delta[row.nome] += 1;
            });

            for (let nation in delta) {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = 
                        (SELECT tesoureiro FROM grupos WHERE grupos.nome = $2)`, [delta[nation], nation]);
            }
        });

        const promise3 = db.makeQuery(`SELECT grupos.nome, recurso FROM grupos, terrestres 
        WHERE (grupos.nome = terrestres.influência1 OR grupos.nome = terrestres.influência2) AND grupos.receita = 'Corporação'`).then((result) => {
            let delta = distribuirRecursos(result.rows);

            for (let nation in delta) {
                db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo = 
                        (SELECT tesoureiro FROM grupos WHERE grupos.nome = $2)`, [delta[nation][0], nation]);
                db.makeQuery(`UPDATE grupos SET commodities = commodities + $1 WHERE grupos.nome = $2`, [delta[nation][1], nation]);
                db.makeQuery(`UPDATE grupos SET ruínas = $1 WHERE grupos.nome = $2`, [delta[nation][2], nation]);
            }
        });

        Promise.all([promise1, promise2, promise3]).then(() => msg.reply("Resolvido. Lembre-se do Bobo e seus parceiros, nem dos Nômades!!"));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
