const db = require('../external/database.js');

var phase = 0;
var channels = {}

const get_phase = () => phase;

const get_channel = async (jogador_id) => {
    let retorno = '';
    if (channels[jogador_id])
        return channels[jogador_id];

    await db.makeQuery(`SELECT canal FROM jogadores WHERE jogador_id = $1`, [jogador_id]).then((result) => {
        if (result.rows[0]) {
            channels[jogador_id] = result.rows[0].canal;
            retorno = result.rows[0].canal;
        }
    });
    return retorno;
}

// Exports
module.exports = {
    name: "set_phase", 
    description: "set_phase <phase(0/1/2)>: muda a fase atual para a especificada.", 
    execute: (com_args, msg) => {
        if (com_args.length < 1)
            return;

        let i = parseInt(com_args[0]);
        if (i !== i)
            return;

        phase = i;
        msg.reply("Fase: " + com_args[0]);
    }, 
    permission: (msg) => msg.member.roles.cache.some(role => role.name == "Moderador"),
    phase: get_phase,
    channel: get_channel
};