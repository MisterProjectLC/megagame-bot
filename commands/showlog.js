var db = require('../external/database.js');

command_log = [];

async function log_command(author, command) {
    await db.getPlayer(author.id).then((response) => {
        command_log.push(response.rows[0].team_name + ", " + response.rows[0].role_name + ": " + command);
    });
}

// Exports
module.exports = {
    name: "showlog", 
    description: "showlog: mostra o log de comandos atual.", 
    execute: (com_args, msg) => {
        let response = "";
        command_log.forEach(command => {response += command + "\n"});
        msg.reply(response);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador"),

    log_command: log_command
};
