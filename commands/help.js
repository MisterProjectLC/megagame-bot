const phase = require('../utils/phase.js');

// Exports
module.exports = {
    name: "help", 
    description: "help [comando]: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", 
    execute: (com_args, msg) => {
        let response = [];
        const { commands } = msg.client;
        commands.forEach((command) => {
            if (!command.permission(msg, phase.get_phase(msg.guild)))
                return;

            if (com_args.length == 0 || command.name == com_args[0])
                response.push(">" + command.description);
        });

        if (response.length > 0) {
            msg.reply(response.slice(0, 20).join("\n"));
            if (response.length >= 20)
                msg.reply(response.slice(20, 40).join("\n"));
        } else
            msg.reply("comando não encontrado...");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador")
};
