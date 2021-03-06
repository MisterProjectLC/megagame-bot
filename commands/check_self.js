var db = require('../external/database.js');

// Exports
module.exports = {
    name: "check_self", 
    description: "check_self: checa seu próprio personagem e sua quantidade de recursos atual.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        await db.getPlayer(msg.author.id).then((response) => {
            let thisJogador = response.rows[0];
            if (!thisJogador)
                msg.reply("Você não tem personagem.");
            else {
                msg.reply(thisJogador.username + ": " + thisJogador.time_nome + ", " + thisJogador.cargo + ". Recursos: " + thisJogador.recursos);
            }
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador")
};
