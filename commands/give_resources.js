var args_invalidos = require('../data/errors.js').args_invalidos;
var db = require('../external/database.js');

// Exports
module.exports = {
    name: "give_resources", 
    description: "give_resources <cargo> <qtd>: dá recursos para a pessoa com o cargo especificado.", 
    min: 2, max: 2,
    execute: (com_args, msg) => {
        // Check args
        if (com_args.length < 2) {
            msg.reply(args_invalidos);
            return;
        }

        // Check amount to give
        let i = parseInt(com_args[1]);
        if (i !== i) {
            msg.reply(args_invalidos);
            return;
        }
        
        db.makeQuery(`UPDATE jogadores SET recursos = recursos + $1 WHERE cargo ILIKE $2;`,
        [com_args[1], com_args[0]]).then((response) => {
            if (response.rowCount == 1)
                msg.reply("Pago.");
        });
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador")
};
