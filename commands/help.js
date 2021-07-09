const phase = require('../utils/phase.js');
const message_break = require('../utils/message_break.js').message_break;

// Exports
module.exports = {
    name: "help", 
    description: "help [comando]: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", 
    min: 0, max: 1,
    execute: (com_args, msg) => {
        let response = [];
        const { commands } = msg.client;
        let currPhase = phase.get_phase(msg.guild);
        commands.forEach((command) => {
            if (!command.permission(msg, currPhase))
                return;

            if (com_args.length == 0 || command.name == com_args[0])
                response.push(">" + command.description);
        });

        message_break(response, "Comando não encontrado...").forEach((message) => msg.reply(message));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador")
};
