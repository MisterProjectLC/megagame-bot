// Discord API
const Discord = require('discord.js');
const Client = new Discord.Client();

// Command
var Commands = require('./commands/commands.js');

const token = '***REMOVED***';


// Comandos
const prefix = ">";
var undefined_msg = "Uh-oh! Valor indefinido!";
const aspas_invalidas = "Uh-oh! Aspas inválidas!";
const perms_invalidos = "Uh-oh! Você não tem permissão para usar esse comando!";


Client.on("ready", () => {
	console.log("Bot online");
    Commands.setup();
});


// Mensagens
Client.on("message", msg => {
	if (msg.author === Client.user || msg.content[0] != prefix)
		return;

    let args = msg.content.substring(prefix.length).split(" ");
    for (let i = 0, j = 0, open = false; i < args.length; i++) {
        if (open)
            args[j] += " " + args[i];

        if (args[i][0] == '"')
            if (!open) {
                args[j] = args[i];
                open = true;
            } else {
                msg.reply(aspas_invalidas);
                return;
            }
        else if (args[i][args[i].length-1] == '"')
            if (open) {
                open = false;
            } else {
                msg.reply(aspas_invalidas);
                return;
            }
        
        if (!open)
            j++;
    }
    console.log(args);

    if (args.length == 0)
        return;

    Commands.command_list.forEach((command) => {
        if (command.name == args[0])
            if (command.permission_func(msg))
                command.func(args.slice(1, args.length), msg);
            else
                msg.reply(perms_invalidos);
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