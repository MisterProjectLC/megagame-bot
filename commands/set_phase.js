var phase = 0;

const get_phase = () => phase;

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
    phase: get_phase
};