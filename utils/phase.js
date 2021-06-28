const get_phase = (guild) => {
    guild.members.cache.each((member) => {
        let role = member.roles.cache.find((role) => role.name.startsWith("Fase "));
        if (role) {
            console.log(parseInt(role.name.slice(4)));
            return parseInt(role.name.slice(4));
        }
    });

    return -1;
}

// Exports
module.exports.get_phase = get_phase;
