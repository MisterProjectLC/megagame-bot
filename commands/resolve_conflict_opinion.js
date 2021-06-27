var db = require('../external/database.js');

const modificação = (atacado, atacante) => {
    // Others react
    db.makeQuery(`UPDATE opiniões SET valor = valor - 1
    WHERE objeto = $2 AND sujeito <> $1
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = $1 AND op.valor > 0)`, 
    [atacado, atacante]);

    db.makeQuery(`UPDATE opiniões SET valor = valor + 1
    WHERE objeto = $2 AND sujeito <> $1
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = $1
    AND op.valor < 0)
    AND EXISTS (SELECT * FROM opiniões AS op WHERE opiniões.sujeito = op.sujeito AND op.objeto = $2 AND op.valor >= 0)`, 
    [atacado, atacante]);
}

// Exports
module.exports = {
    name: "resolve_conflict_opinion", 
    description: "resolve_conflict_opinion <atacante> <atacado>: modifica as OPs de todos após um ataque de uma nação contra outra nação.",
    execute: async (com_args, msg) => {
        // Args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        modificação(com_args[1], com_args[0]);
        msg.reply("Resolvido.");
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
