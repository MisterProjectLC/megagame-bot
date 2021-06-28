var db = require('../external/database.js');


// Exports
module.exports = {
    name: "check_custom_log", 
    description: "check_custom_log: mostra o log de comandos atual.", 
    execute: async (com_args, msg) => {
        let logs = await db.makeQuery(`SELECT * FROM logs WHERE sucesso = true AND nome = 'custom' ORDER BY prioridade`, );

        let response = [];
        logs.rows.forEach(command => {response.push(command.comando)});

        if (response.length == 0)
            msg.reply("log vazio.");
        else
            for (let i = 0; i < response.length; i += 20)
                msg.reply(response.slice(i, i+20).join("\n"));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
