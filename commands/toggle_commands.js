var commandsEnabled = true;

// Exports
module.exports = {
    name: "toggle_commands", 
    description: "toggle_commands: ativa/desativa comandos para não-moderadores.", 
    execute: () => {
        commandsEnabled = !commandsEnabled;
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador"),
    commandsEnabled: commandsEnabled
};
