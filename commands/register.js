var db = require('../external/database.js');

// Exports
module.exports = {
    name: "register", 
    description: "register <person> <team> <name>: teste debug haaaa", 
    execute: (com_args, msg) => {
        if (com_args.length < 3 || !msg.mentions.users.first()) {
            msg.reply(args_invalidos);
            return;
        }
        db.insertPlayer(msg.mentions.users.first().id, msg.mentions.users.first().username, com_args[1], com_args[2]).then(() => 
            msg.reply("Registrado."));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
