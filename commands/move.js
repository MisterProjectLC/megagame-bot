var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');
var log = require('./check_log.js');

var isPathValidSea = async (origin, destination, qtd, author_id) => {
    let retorno = false;
    // Check if there's a clear path
    await db.makeQuery(`SELECT tera, terb, nação FROM (adjacentes LEFT OUTER JOIN frotas 
        ON adjacentes.tera = frotas.território) WHERE adjacentes.tera ilike 'O%' AND adjacentes.terb ilike 'O%' 
        AND (nação IS NULL OR nação = (SELECT time_nome FROM jogadores WHERE jogador_id = $1) OR
        EXISTS (SELECT nação2 FROM tratados_fronteiras WHERE nação1 = nação AND nação2 = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)))`,
    [author_id]).then((response) => {
        let rows = response.rows;
        let regionsToCheck = [];
        let regionsChecked = [];
        regionsToCheck.push(origin);

        // Check this region
        while (regionsToCheck.length > 0 && !retorno) {
            console.log(regionsToCheck);
            // Get adjacencies from this region
            rows.filter((row) => row.tera == regionsToCheck[0]).forEach((row) => {
                if (row.terb == destination)
                    retorno = true;
                else if (regionsToCheck.indexOf(row.terb) == -1 && regionsChecked.indexOf(row.terb) == -1)
                    regionsToCheck.push(row.terb);
            });
            regionsChecked.push(regionsToCheck[0]);
            regionsToCheck = regionsToCheck.slice(1);
        }
    });
    return retorno;
}


var isPathValidLand = async (origin, destination, qtd, author_id) => {
    let retorno = null;
    // Check if adjacent
    await db.makeQuery(`SELECT * FROM adjacentes, terrestres
    WHERE terrestres.nome = adjacentes.terA AND adjacentes.terA = $1 AND terrestres.tropas >= $2`,
    [origin, qtd]).then((responser) => {
        let rows = responser.rows;
        if (rows.length <= 0) {
            retorno = false;
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].terb == destination) {
                retorno = true;
                return;
            }
        }
    });

    if (retorno != null)
        return retorno;

    // Check if bridge
    await db.makeQuery(`SELECT * FROM adjacentes, frotas
    WHERE frotas.território = adjacentes.terA AND frotas.nação = (SELECT time_nome FROM jogadores WHERE jogador_id = $1)`,
    [author_id]).then((response) => {
        let rows = response.rows;
        let regionsToCheck = [];
        let regionsChecked = [];
        for (let i = 0; i < rows.length; i++) {
            // Found first step
            if (rows[i].terb == origin) {
                regionsToCheck.push(rows[i].tera);
                break;
            }
        }

        // Check this region
        retorno = false;
        while (regionsToCheck.length > 0 && !retorno) {
            // Get adjacencies from this region
            rows.filter((row) => row.tera == regionsToCheck[0]).forEach((row) => {
                if (row.terb == destination)
                    retorno = true;
                else if (regionsToCheck.indexOf(row.terb) == -1 && regionsChecked.indexOf(row.terb) == -1)
                    regionsToCheck.push(row.terb);
            });
            regionsChecked.push(regionsToCheck[0]);
            regionsToCheck = regionsToCheck.slice(1);
        }
    });

    return retorno;
}


// Exports
module.exports = {
    name: "move", 
    description: "move <origem> <destino> [qtd]: move tropas (tanto terrestres quanto maritimas). Pode demorar para carregar um pouco.", 
    min: 2, max: 3,
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Checa tropas
        let tropas = 1;
        if (com_args.length >= 3) {
            tropas = parseInt(com_args[2]);
            if (tropas !== tropas || tropas <= 0) {
                msg.reply(args_invalidos);
                return;
            }
        } else
            com_args.push('1');

        // Checa se movimento é válido
        let kill = false;
        await db.makeQuery('SELECT * FROM territórios WHERE (nome = $1 OR nome = $2)', [com_args[0], com_args[1]]).then(async (response) => {
            let rows = response.rows;
            if (rows.length < 2 || rows[0].isterrestre != rows[1].isterrestre)
                kill = true;
            else {
                if (rows[0].isterrestre)
                    await isPathValidLand(com_args[0], com_args[1], tropas, msg.author.id).then(response => {kill = !response;});
                else
                    await isPathValidSea(com_args[0], com_args[1], tropas, msg.author.id).then(response => {kill = !response;});
            }
        });
        if (kill) {
            msg.reply(args_invalidos);
            return;
        }

        log.logCommand(msg, "move " + tropas + " tropas de " + com_args[0] + " para " + com_args[1] + ".", "move", com_args);
    },
    permission: (msg, phase) => msg.member.roles.cache.some(role => role.name == "Militar") && phase == 1,
    command: async (com_args, author_id) => {
        let movers = parseInt(com_args[2]);
        db.makeQuery("SELECT tropas FROM terrestres WHERE nome = $1", [com_args[0]]).then((response) => {
            let rows = response.rows;
            if (rows[0]) {
                let tropas = parseInt(rows[0].tropas);
                db.makeQuery("UPDATE terrestres SET tropas = $2 WHERE nome = $1", [com_args[0], Math.max( 0, tropas - movers )]);
                db.makeQuery("INSERT INTO movimentos VALUES ($1, $2, $3, (SELECT time_nome FROM jogadores WHERE jogador_id = $4))", 
                [com_args[0], com_args[1], Math.min( tropas, movers ), author_id]);
            }
        });

        db.makeQuery("SELECT tamanho FROM frotas WHERE território = $1 AND nação = (SELECT time_nome FROM jogadores WHERE jogador_id = $2)", 
                    [com_args[0], author_id]).then((response) => {
            let rows = response.rows;
            if (rows[0]) {
                let frotas = parseInt(rows[0].tamanho);
                db.makeQuery("UPDATE frotas SET tamanho = $2 WHERE território = $1", [com_args[0], Math.max( 0, frotas - movers )]);
                db.makeQuery("INSERT INTO movimentos VALUES ($1, $2, $3, (SELECT time_nome FROM jogadores WHERE jogador_id = $4))", 
                [com_args[0], com_args[1], Math.min( frotas, movers ), author_id]);
            }
        });
    }
};
