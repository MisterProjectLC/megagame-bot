var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');


var influence = async (com_args, msg, command_name) => {
    if (typeof command_name === 'undefined')
        command_name = "influence";

    // Checa slot
    let slot = parseInt(com_args[1]);
    if (slot !== slot || slot <= 0 || slot > 2) {
        msg.reply(args_invalidos);
        return;
    }

    // Checa se território existe
    let kill = false;
    await db.makeQuery('SELECT * FROM territórios WHERE nome ILIKE $1', [com_args[0]]).then((response) => {
        if (response.rows.length < 1)
            kill = true;
    });
    if (kill) {
        msg.reply(args_invalidos);
        return;
    }
    
    log.logCommand(msg, "influencia o slot " + slot + " de " + com_args[0] + ".", "influence", com_args);
};


// Exports
module.exports = {
    name: "influence", 
    description: "influence <território> <slot(1/2)>: coloca sua influência no slot escolhido.", 
    min: 2, max: 2,
    execute: influence,
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Chefe de Facção" || role.name == "Espectador") && phase == 1,
    command: (com_args, author_id) => {
        db.makeQuery(`UPDATE terrestres SET influência` + com_args[1] + ` = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)
         WHERE nome ILIKE $2`, [author_id, com_args[0]]);
    }
};
