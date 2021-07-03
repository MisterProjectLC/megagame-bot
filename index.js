// Discord API
const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
const token = '***REMOVED***';

const db = require('./external/database.js');
const log = require('./commands/check_log.js');
const phase = require('./utils/phase.js');
const args_invalidos = require('./data/errors.js').args_invalidos;

// Comandos
const prefix = ">";
var undefined_msg = "Valor indefinido.";
const aspas_invalidas = "Aspas inválidas.";
const perms_invalidos = "Você não tem permissão para usar esse comando aqui e/ou agora.";
Client.commands = new Discord.Collection();


var channels = {};
const get_channel = async (jogador_id) => {
    let retorno = '';
    if (channels[jogador_id])
        return channels[jogador_id];

    await db.makeQuery(`SELECT canal FROM jogadores WHERE jogador_id = $1`, [jogador_id]).then((result) => {
        if (result.rows[0]) {
            channels[jogador_id] = result.rows[0].canal;
            retorno = result.rows[0].canal;
        }
    });
    return retorno;
}



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

        if (args[i][0] == '"') {
            if (args[i][args[i].length-1] != '"')
                if (!open) {
                    args[j] = args[i].slice(1, args[i].length);
                    open = true;
                } else {
                    msg.reply(aspas_invalidas);
                    return;
                }
            else
                args[j] = args[i].slice(1, args[i].length-1);
        } else if (args[i][args[i].length-1] == '"')
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

        args = args.slice(0, j+1);
    }

    // Comando
    const { commands } = msg.client;
    commands.forEach(async (command) => {
        if (command.name == args[0]) {
            console.log(args[0]);
            args = args.slice(1);
            let usersChannel = await get_channel(msg.author.id);

            let currentPhase = phase.get_phase(msg.guild);
            if (command.min && command.max && !(command.min <= args.length && args.length <= command.max)) {
                console.log(command.min, command.max, args);
                msg.reply(args_invalidos);
                return;
            }

            if (command.permission(msg, currentPhase) && msg.channel.id == usersChannel &&
                    (currentPhase != 2 || msg.member.roles.cache.some(role => role.name == "Moderador")))
                command.execute(args, msg);
            else
                msg.reply(perms_invalidos);
        }
    })
});

Client.login(token);