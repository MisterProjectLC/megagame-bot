var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./show_log.js');

// Exports
module.exports = {
    name: "execute_log", 
    description: "execute_log [n]: executa o primeiro comando logado. Caso 'n' seja dado, executa o comando na posição n.", 
    execute: async (com_args, msg) => {
        let n = 1;
        if (com_args.length > 0) {
            n = parseInt(com_args[0]);
            if (n !== n || n <= 0) {
                msg.reply(args_invalidos);
                return;
            }
        }
        log.executeCommand(msg, n);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
