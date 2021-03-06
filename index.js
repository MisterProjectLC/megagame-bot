// Discord API
const fs = require('fs');
const Discord = require('discord.js');
const Client = new Discord.Client();
const token = 'BOA TENTATIVA HACKERZINHO WOWOWOWOW';

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

const usageCooldowns = new Discord.Collection();

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


const send_message = (channel, message) => {
    const send_channel = Client.channels.cache.get(channel);
    send_channel.send(message);
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

        if (args[i][0] == '"' || args[i][0] == '“') {
            if (args[i][args[i].length-1] != '"' && args[i][args[i].length-1] != '“')
                if (!open) {
                    args[j] = args[i].slice(1, args[i].length);
                    open = true;
                } else {
                    msg.reply(aspas_invalidas);
                    return;
                }
            else
                args[j] = args[i].slice(1, args[i].length-1);
        } else if (args[i][args[i].length-1] == '"' || args[i][args[i].length-1] == '“')
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
    args = args.slice(0, j);

    // Comando
    const { commands } = msg.client;
    let kill = false;
    commands.forEach(async (command) => {
        // Run command
        if (command.name == args[0] && !kill) {
            kill = true;
            console.log(args);
            args = args.slice(1);
            let usersChannel = await get_channel(msg.author.id);

            // Check args
            let currentPhase = phase.get_phase(msg.guild);
            if (command.min && command.max && !(command.min <= args.length && args.length <= command.max)) {
                msg.reply(args_invalidos);
                return;
            }

            if (!(command.permission(msg, currentPhase) && msg.channel.id == usersChannel && 
            (currentPhase != 2 || msg.member.roles.cache.some(role => role.name == "Moderador")))) {
                msg.reply(perms_invalidos);
                return;
            }

            // Checa cooldown - créditos para Marcus Vinicius Natrielli Garcia
            if (!usageCooldowns.has(command.name))
                usageCooldowns.set(command.name, new Discord.Collection());

            const now = Date.now();
            const timestamps = usageCooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 0) * 1000;
            if (timestamps.has(msg.author.id)) {
                const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
            
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    msg.reply(`Por favor espere mais ${timeLeft.toFixed(1)} segundos para usar este comando`);
                    return;
                }
            }

            command.execute(args, msg, send_message);
            if (command.name == 'undo')
                timestamps.set(msg.author.id, now);
        }
    })
});

Client.login(token);