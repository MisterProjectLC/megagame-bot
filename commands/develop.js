var args_invalidos = require('../utils/command.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./show_log.js');

// Exports
module.exports = {
    name: "develop", 
    description: `develop <tecnologia> <especializações> <explicação>: faz pesquisa APLICADA. Exemplo:\n
    develop "Teoria dos Memes" "Virologia, Sociologia" "Teoria de como ideias se espalham como vírus. Com isso, posso influenciar 2 slots ao invés de 1."`, 
    execute: async (com_args, msg) => {
        if (com_args.length < 3) {
            msg.reply(args_invalidos);
            return;
        }
        
        msg.reply("Comando enviado.");
        await log.logCommand(msg, "desenvolve " + com_args[0] + ", usando " + com_args[1] + ". Explicação: " + com_args[2], "develop", com_args);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Cientista"),
    command: (com_args) => {
        console.log(com_args);
    }
};
