var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_treaties", 
    description: "check_treaties: mostra os tratados da sua nação DESTE TURNO.", 
    execute: async (com_args, msg) => {
        await db.makeQuery(`SELECT *
        FROM tratados_fronteiras, jogadores
        WHERE jogadores.jogador_id = $1 AND jogadores.time_nome = tratados_fronteiras.nação1`, 
        [msg.author.id]).then((result) => {
            let response = "Tratados de fronteiras abertas com:\n";
            result.rows.forEach((row) => {
                response += row.nação2 + "\n";
            });

            if (result.rows[0])
                msg.reply(response);
            else
                msg.reply('nenhum tratado encontrado.')
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Estado")
};
