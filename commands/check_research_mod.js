var db = require('../external/database.js');
var areas = require('../data/research_areas.json').areas;

// Exports
module.exports = {
    name: "check_research_mod", 
    description: "check_research_mod <grupo>: mostra as especializações e tecnologias do grupo selecionado.", 
    execute: async (com_args, msg) => {
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        await db.makeQuery(`SELECT nome, descrição FROM pesquisas WHERE $1 = pesquisas.grupo ORDER BY descrição`, [com_args[0]]).then((result) => {
            let response = "";
            result.rows.forEach((row) => {
                if (areas.indexOf(row.descrição) != -1)
                    response += "Especialização - " + row.nome + ", Área: " + row.descrição + "\n";
                else
                    response += "Tecnologia - " + row.nome + ": " + row.descrição + "\n";
            });

            
            if (response == '')
                msg.reply('nenhuma pesquisa encontrada.')
            else
                msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
