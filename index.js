// Discord API
const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
const token = '***REMOVED***';

const db = require('./external/database.js');
const log = require('./commands/check_log.js');
const check = require('./commands/set_phase.js');

// Comandos
const prefix = ">";
var undefined_msg = "Valor indefinido.";
const aspas_invalidas = "Aspas inválidas.";
const perms_invalidos = "Você não tem permissão para usar esse comando aqui e/ou agora.";
Client.commands = new Discord.Collection();

// Gera os comandos - créditos para Marcus Vinicius Natrielli Garcia
const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Client.commands.set(command.name, command);
    if (command.command)
        log.addToList(command.name, command.command);
}

// Inicialização
Client.on("ready", () => {
	console.log("Bot online");
    db.connectDB();
});

// Mensagens
Client.on("message", msg => {
	if (msg.author === Client.user || msg.content[0] != prefix)
		return;

    // Args
    let args = msg.content.substring(prefix.length).split(" ");
    if (args.length == 0)
        return;

    // Aspas
    let j = 0;
    for (let i = 0, open = false; i < args.length; i++) {
        if (open)
            args[j] += " " + args[i];
        else
            args[j] = args[i];

        if (args[i][0] == '"')
            if (!open) {
                args[j] = args[i].slice(1, args[i].length);
                open = true;
            } else {
                msg.reply(aspas_invalidas);
                return;
            }
        else if (args[i][args[i].length-1] == '"')
            if (open) {
                args[j] = args[j].slice(0, args[j].length-1);
                open = false;
            } else {
                msg.reply(aspas_invalidas);
                return;
            }
        
        if (!open) {
            j++;
        }
    }

    // Comando
    const { commands } = msg.client;
    commands.forEach(async (command) => {
        if (command.name == args[0]) {
            console.log(args[0]);
            let usersChannel = await check.channel(msg.author.id);

            if (command.permission(msg, check.phase()) && msg.channel.id == usersChannel &&
                (check.phase() != 2 || msg.member.roles.cache.some(role => role.name == "Moderador")))
                command.execute(args.slice(1, j), msg);
            else
                msg.reply(perms_invalidos);
        }
    })
});

Client.login(token);