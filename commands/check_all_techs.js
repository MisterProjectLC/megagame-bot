var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "check_all_techs", 
    description: "check_all_techs: mostra todas as techs do jogo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT nome, grupo, descrição FROM pesquisas ORDER BY descrição`).then((result) => {
            let response = [];
            result.rows.forEach((row) => {
                if (areas.indexOf(row.descrição) == -1)
                    response.push(row.grupo + " - " + row.nome + ": " + row.descrição + "\n");
            });

            if (response.length == 0)
                msg.reply('nenhuma tecnologia encontrada.')
            else {
                let j = 0;
                for (let i = 0, size = 0; i < response.length; i++) {
                    size += response[i].length;
                    if (size >= 1800) {
                        msg.reply(response.slice(j, i).join("\n"));
                        j = i;
                        size = 0;
                        i--;
                    }
                }

                if (j != response.length-1)
                    msg.reply(response.slice(j, response.length).join("\n"));
            }
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
