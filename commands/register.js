var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "register", 
    description: "register <jogador_id> <username> <grupo> <título> <canal>: registra um jogador.", 
    min: 5, max: 5,
    execute: (com_args, msg) => {
        if (com_args.length < 5) {
            msg.reply(args_invalidos);
            return;
        }
        
        db.makeQuery(`INSERT INTO jogadores (jogador_id, username, time_nome, cargo, canal) 
        VALUES ($1, $2, $3, $4, $5);`, com_args).then(() => msg.reply("Registrado."), () => msg.reply(args_invalidos));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
