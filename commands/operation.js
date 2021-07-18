var args_invalidos = require('../data/errors.js').args_invalidos;
var log = require('./check_log.js');

// Exports
module.exports = {
    name: "operation", 
    description: "operation <alvo> <descrição>: lança operação contra alvo.", 
    min: 2, max: 2,
    execute: (com_args, msg) => {      
        log.logCommand(msg, "lança operação contra " + com_args[0] + ". Descrição: " + com_args[1] + ".", "operation", com_args);
    }, 
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Militar" || role.name == "Turing Tester" || role.name == "Espectador") 
    && phase == 1,
    command: (com_args) => {
        
    }
};
