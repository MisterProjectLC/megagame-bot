// Discord API
const Discord = require('discord.js');
const Client = new Discord.Client();

// Save database
const db = require('./external/database.js');

// Command
var Command = require('./command');

const token = '***REMOVED***';


Client.on("ready", () => {
	console.log("Bot online");
});

// Comandos
const prefix = ">";
var undefined_msg = "Uh-oh! Valor indefinido!";
const args_invalidos = "Uh-oh! Numero de argumentos invalidos!";

// Database
db.

// Mensagens
Client.on("message", msg => {
	if (msg.author === Client.user)
		return;

    let args = msg.content.substring(prefix.length).split(" ");
    let charname = character_of(msg.author.id);
    let command_list = [];

    command_list.push(Command.command("help", "help <comando>: Explica a sintaxe de um comando. Se nenhum comando for dado, explica todos.", (com_args) => {
        let response = "";
        for (let command in command_list) {
            if (com_args.length == 0)
                response += command.description;
            else if (command.name == args[0])
                return command.description;
        }
        return response;
    }));

    for (let command in command_list) {
        if (command.name == args[0]) {
            command.com_function(args.slice(1, args.length));
        }
    }

	switch (args[0]) {
		// Fala os comandos
		case "help":
            msg.reply();
			break;

        case "spend":
            if (args.length >= 3) {
                var amount_spent;
                if (args.length == 3)
                    amount_spent = 1
                else
                    amount_spent = args[3]

                var package = CharManager.spend_spell_char(parseInt(args[2]), amount_spent, charname);
                if (package == null) { msg.reply(undefined_msg); return; }

                msg.reply("\nSlots de level " + args[2].toString(10) + ": " + package[0][args[2]].toString(10));
                save(charname, "spellslots", package[0]);
            } else {
                    msg.reply(args_invalidos);
            }
            break;
	}
});


Client.login(token);


//

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