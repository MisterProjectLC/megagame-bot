var db = require('../external/database.js');

priorityList = {"overload":-2,
                "grant":-1,
                "propaganda":0,
                "bribe":1,
                "investigate":2,
                "recruit":3,
                "move":4,
                "research":5,
                "develop":6,
                "purge":7,
                "influence":8,
                "trade":9
                };

functionList = {}

function addToList(key, value) {
    functionList[key] = value;
}

async function logCommand(msg, command, name, args, custo) {
    if (typeof(custo)==='undefined') 
        custo = 1;

    let author = msg.author;
    await db.getPlayer(author.id).then(async (response) => {
        // Log
        let player = response.rows[0];
        let log = player.time_nome + ", " + player.cargo + ": " + command;

        // Economia
        if (custo > 0) {
            if (player.recursos - custo < 0) {
                msg.reply("Recursos insuficientes!");
                return -1;
            }
            db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2`, [custo, author.id]);
        }

        // Lealdade
        let loyalty = 20;
        let result = await db.makeQuery(`SELECT lealdade FROM jogadores, nações WHERE jogador_id = $1 AND time_nome = nações.nome`, [author.id]);
        if (result.rows[0])
            loyalty = parseInt(result.rows[0].lealdade);
        let success = (Math.floor(Math.random() * 20) <= loyalty);

        // Log feito
        db.makeQuery("INSERT INTO logs(jogador, comando, nome, prioridade, args, custo, sucesso) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
        [author.id, log, name, priorityList[name], args.join('§'), custo, success]);
    });
    msg.reply("Comando enviado.");
    return 0;
}

async function undoCommand(msg, n) {
    let author = msg.author;
    await db.makeQuery(`SELECT * FROM logs WHERE jogador = $1 AND idade = $2`, [author.id, n]).then(async (response) => {
        let thisLog = response.rows[0];
        if (!thisLog) {
            msg.reply("Log não encontrado.");
            return;
        }

        // Economia
        if (thisLog.custo > 0)
            await db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE jogador_id = $2`, [thisLog.custo, author.id]);

        // Log desfeito
        await db.makeQuery(`DELETE FROM logs WHERE jogador = $1 AND idade = $2`, [author.id, n]);
        msg.reply("Comando removido.");
    });
}


async function executeCommand(msg, n) {
    let logs = await db.makeQuery("SELECT * FROM logs WHERE sucesso = true ORDER BY prioridade");
    let nn = n -1;
    if (logs.rows[nn]) {
        let command = logs.rows[nn];
        functionList[command.nome](command.args.split('§'), command.jogador);
        db.makeQuery("DELETE FROM logs WHERE ctid IN (SELECT ctid FROM logs WHERE sucesso = true ORDER BY prioridade LIMIT 1 OFFSET " + 
                        nn + ")");
        msg.reply("Executado.");
    } else {
        msg.reply("log vazio.");
    }
}


// Exports
module.exports = {
    name: "check_log", 
    description: "check_log: mostra o log de comandos atual.", 
    execute: async (com_args, msg) => {
        let sql = "", values = [];
        if (msg.member.roles.cache.some(role => role.name == "Moderador")) {
            sql = "SELECT * FROM logs WHERE sucesso = $1 ORDER BY prioridade";
            values = [true];
        } else {
            sql = "SELECT * FROM logs WHERE jogador = $1 ORDER BY idade";
            values = [msg.author.id];
        }
        let logs = await db.makeQuery(sql, values);

        let response = "";
        logs.rows.forEach(command => {response += command.comando + "\n"});
        if (response == "")
            msg.reply("log vazio.");
        else
            msg.reply(response);
    }, 
    permission: (msg) => true,

    logCommand: logCommand,
    undoCommand: undoCommand,
    executeCommand: executeCommand,
    addToList: addToList
};
