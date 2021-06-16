// Command
var Command = require('./command.js');

// Database
const db = require('../external/database.js');

setup = () => { db.connectDB();}

// Commands ------------------------------
const args_invalidos = "Uh-oh! Argumentos inválidos!";
var command_list = [];

command_list.push(new Command.command("help", 
"help [comando]: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", (com_args, msg) => {
    let response = "";
    command_list.forEach((command) => {
        if (!command.permission_func(msg))
            return;

        if (com_args.length == 0)
            response += command.description + "\n";
        else if (command.name == com_args[0])
            response = command.description;
    });

    if (response.length > 0)
        msg.reply(response);
    else
        msg.reply("comando não encontrado...");
}, (msg) => true
));

command_list.push(new Command.command("register", "register <person> <team> <name>: teste debug haaaa", (com_args, msg) => {
    if (com_args.length < 3 || !msg.mentions.users.first()) {
        msg.reply(args_invalidos);
        return;
    }
    db.insertPlayer(msg.mentions.users.first().id, msg.mentions.users.first().username, com_args[1], com_args[2]).then(() => 
        msg.reply("Registrado."));
}, (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
));

command_list.push(new Command.command("checkself", "checkself: teste debug haaaa", async (com_args, msg) => {
    await db.getPlayer(msg.author.id).then((response) => {
        console.log(response.rows[0]);
        msg.reply(response.rows[0].player_username + ": " + response.rows[0].team_name + ", " + response.rows[0].role_name);
    });
}, (msg) => true
));


// Exports
module.exports.command_list = command_list;
module.exports.setup = setup;
