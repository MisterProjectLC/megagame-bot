var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_presence", 
    description: "check_presence: mostra todas as presenças da sua facção no globo.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        let time_nome = '';
        
        await db.makeQuery(`SELECT time_nome, cargo FROM jogadores WHERE jogador_id = $1`, [msg.author.id]).then((result) => {
            let jogador = result.rows[0];
            time_nome = jogador.time_nome;
            let cargo = jogador.cargo;
            if (cargo == 'Diretor de Naga')
                time_nome = 'Naga';
            else if (cargo == 'Diretor de Mitsu')
                time_nome = 'Mitsu';
            else if (cargo == 'Imperador')
                time_nome = 'Centauros';
        });

        await db.makeQuery(`SELECT * FROM terrestres WHERE influência1 = $1 OR influência2 = $1`, [time_nome]).then((result) => {
            let response = "Presença:\n";
            result.rows.forEach((row) => {
                if (row.influência1 == time_nome)
                    response += row.nome + "- Slot 1\n";
                if (row.influência2 == time_nome)
                    response += row.nome + "- Slot 2\n";
            });

            msg.reply(response);
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Chefe de Facção" || 
    role.name == "Nagamitsu" || role.name == "Espectador") || (msg.member.roles.cache.some(role => role.name == "Centauros") && 
    msg.member.roles.cache.some(role => role.name == "Chefe de Estado"))
};
