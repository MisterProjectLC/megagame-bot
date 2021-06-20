var args_invalidos = require('../utils/command.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "undo", 
    description: "undo [n]: cancela o último comando. Caso 'n' seja dado, cancela o comando dado n comandos atrás.", 
    execute: async (com_args, msg) => {
        let n = 1;
        if (com_args.length > 0) {
            n = parseInt(com_args[0]);
            if (n !== n || n <= 0) {
                msg.reply(args_invalidos);
                return;
            }
        }
        log.undoCommand(msg, n);
    }, 
    permission: (msg) => true,
};
