var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "register", 
    description: "register <jogador> <grupo> <título> <canal>: registra um jogador.", 
    execute: (com_args, msg) => {
        if (com_args.length < 4 || !msg.mentions.users.first()) {
            msg.reply(args_invalidos);
            return;
        }
        
        db.makeQuery(`INSERT INTO jogadores (jogador_id, username, time_nome, cargo, canal) 
        VALUES ($1, $2, $3, $4, $5);`,
        [msg.mentions.users.first().id, msg.mentions.users.first().username, com_args[1], com_args[2], com_args[3]]).then(() => 
            msg.reply("Registrado."));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
