// Discord API
const Discord = require('discord.js');
const Client = new Discord.Client();

// Save database
const db = require('./external/database.js');

// Command
var Command = require('./utils/command.js');

const token = '***REMOVED***';


// Comandos
const prefix = ">";
var undefined_msg = "Uh-oh! Valor indefinido!";
const args_invalidos = "Uh-oh! Numero de argumentos invalidos!";
var command_list = [];


Client.on("ready", () => {
	console.log("Bot online");
    db.connectDB();
});


command_list.push(new Command.command("help", 
"help <comando>: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", (com_args, msg) => {
    let response = "";
    command_list.forEach((command) => {
        if (com_args.length == 0)
            response += command.description + "\n";
        else if (command.name == com_args[0])
            response = command.description;
    });
    msg.reply(response);
}));

command_list.push(new Command.command("registerself", "registerself [team] [name]: teste debug haaaa", (com_args, msg) => {
    if (com_args.length < 2)
        return args_invalidos;
    db.insertPlayer(msg.author.id, msg.author.username, com_args[0], com_args[1]).then(() => console.log("Registrado."));
}));

command_list.push(new Command.command("checkself", "checkself: teste debug haaaa", async (com_args, msg) => {
    await db.getPlayer(msg.author.id).then((response) => {
        console.log(response.rows[0]);
        msg.reply(response.rows[0]);
    });
}));


// Mensagens
Client.on("message", msg => {
	if (msg.author === Client.user || msg.content[0] != prefix)
		return;

    let args = msg.content.substring(prefix.length).split(" ");
    if (args.length == 0)
        return;

    command_list.forEach((command) => {
        if (command.name == args[0])
            command.func(args.slice(1, args.length), msg);
    })
});

Client.login(token);


/*
emitter.on(eventName, listener)#
eventName <string> | <symbol> The name of the event.
listener <Function> The callback function
Returns: <EventEmitter>
Adds the listener function to the end of the listeners array for the event named eventName. No checks are made to see if the listener has already been added. Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.

server.on('connection', (stream) => {
  console.log('someone connected!');
});
Returns a reference to the EventEmitter, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The emitter.prependListener() method can be used as an alternative to add the event listener to the beginning of the listeners array.

const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a

*/