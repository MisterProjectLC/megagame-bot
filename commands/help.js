// Exports
module.exports = {
    name: "help", 
    description: "help [comando]: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", 
    execute: (com_args, msg) => {
        let response = "";
        const { commands } = msg.client;
        commands.forEach((command) => {
            if (!command.permission(msg))
                return;

            if (com_args.length == 0)
                response += ">" + command.description + "\n";
            else if (command.name == com_args[0])
                response = command.description;
        });

        if (response.length > 0)
            msg.reply(response);
        else
            msg.reply("comando não encontrado...");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador")
};
