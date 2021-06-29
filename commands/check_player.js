var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_player", 
    description: "check_player <cargo>: checa o personagem com o cargo selecionado.",
    execute: async (com_args, msg) => {
        if (com_args < 1)
        if (com_args.length < 1) {
            msg.reply(args_invalidos);
            return;
        }

        await db.makeQuery(`SELECT * FROM jogadores WHERE $1 = cargo`, [com_args[0]]).then((response) => {
            let thisJogador = response.rows[0];
            if (!thisJogador)
                msg.reply("Esse personagem não existe.");
            else {
                msg.reply(thisJogador.username + ": " + thisJogador.time_nome + ", " + thisJogador.cargo + ". Recursos: " + thisJogador.recursos);
            }
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
