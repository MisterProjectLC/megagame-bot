var db = require('../external/database.js');

priorityList = {"custom":-30,
                "overload":-20,
                "grant":-10,
                "investigate":0,
                "operation":10,
                "propaganda":20,
                "bribe":30,
                "strike":35,
                "recruit":40,
                "move":50,
                "research":60,
                "develop":70,
                "purge":80,
                "influence":90,
                "trade":100
                };

functionList = {}

function addToList(key, value) {
    functionList[key] = value;
}

async function logCommand(msg, command, name, args, custo) {
    if (typeof(custo)==='undefined') 
        custo = 1;

    let author = msg.author;
    let retorno = 0;
    await db.getPlayer(author.id).then(async (response) => {
        // Log
        let player = response.rows[0];
        let log = player.time_nome + ", " + player.cargo + ": " + command;

        // Economia
        if (custo > 0) {
            if (player.recursos - custo < 0) {
                msg.reply("Recursos insuficientes!");
                retorno = -1;
                return;
            }
            db.makeQuery(`UPDATE jogadores SET recursos = recursos - $1 WHERE jogador_id = $2`, [custo, author.id]);
        }

        // Lealdade
        let loyalty = 20;
        let result = await db.makeQuery(`SELECT lealdade FROM jogadores, nações WHERE jogador_id = $1 AND time_nome = nações.nome`, [author.id]);
        if (result.rows[0])
            loyalty = parseInt(result.rows[0].lealdade);
        let success = (Math.floor(Math.random() * 21) <= loyalty);

        // Log feito
        db.makeQuery("INSERT INTO logs(jogador, comando, nome, prioridade, args, custo, sucesso) VALUES ($1, $2, $3, $4, $5, $6, $7)", 
        [author.id, log, name, priorityList[name], args.join('§'), custo, success]);
    });

    if (retorno == 0)
        msg.reply("Comando enviado.");
    return retorno;
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


async function executeCommand(msg, n, execute) {
    let logs = await db.makeQuery("SELECT * FROM logs WHERE sucesso = true ORDER BY prioridade");
    let nn = n -1;
    if (logs.rows[nn]) {
        let command = logs.rows[nn];
        if (execute)
            functionList[command.nome](command.args.split('§'), command.jogador);
        db.makeQuery("DELETE FROM logs WHERE ctid IN (SELECT ctid FROM logs WHERE sucesso = true ORDER BY prioridade LIMIT 1 OFFSET " + 
                        nn + ")");

        if (execute)
            msg.reply("Executado.");
        else
            msg.reply("Cancelado.");
    } else {
        msg.reply("log vazio.");
    }
}


// Exports
module.exports = {
    name: "check_log", 
    description: "check_log: mostra o log de comandos atual.", 
    min: 0, max: 0,
    execute: async (com_args, msg) => {
        let sql = "", values = [];
        if (msg.member.roles.cache.some(role => role.name == "Moderador"))
            sql = "SELECT * FROM logs WHERE sucesso = true ORDER BY prioridade";
        
        else {
            sql = "SELECT * FROM logs WHERE jogador = $1 ORDER BY idade";
            values = [msg.author.id];
        }
        let logs = await db.makeQuery(sql, values);

        let response = [];
        logs.rows.forEach(command => {response.push(command.comando)});

        if (response.length == 0)
            msg.reply("log vazio.");
        else
            for (let i = 0; i < response.length; i += 10)
                msg.reply(response.slice(i, i+10).join("\n"));
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Participante" || role.name == "Espectador"),

    logCommand: logCommand,
    undoCommand: undoCommand,
    executeCommand: executeCommand,
    addToList: addToList
};