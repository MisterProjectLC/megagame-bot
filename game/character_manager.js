// character_manager.js

// Character ------------------------------

var xp_chart = {
    1: 300,
    2: 900,
    3: 2700,
    4: 6500,
    5: 14000,
    6: 23000,
    7: 34000,
    8: 48000,
    9: 64000
}

var character = function(name, race, game_class, hp, max_hp, level, xp) {
    this.name = name;
    this.race = race;
    this.game_class = game_class;

    this.hp = hp;
    this.hp_temp = 0;
    this.max_hp = max_hp;
    this.spellslots = {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0};

    this.level = level;
    this.xp = xp;
    this.max_xp = xp_chart[level];

    this.ficha = function () {
        let ficha_inicial = "\nNome: " + this.name + "\nRaça: " + this.race + "\nClasse: " + this.game_class
            + "\n\nHP: " + this.hp.toString(10) + " (+" + this.hp_temp.toString(10) + ") /" + this.max_hp.toString(10) +
            "\n\nLevel: " + this.level.toString(10) + "\nXP: " + this.xp.toString(10) + "/" + this.max_xp.toString(10) + "\n";

        for (var i = 1; i < 10; i++) {
            ficha_inicial = ficha_inicial + "\nSS" + i.toString() + ": " + this.spellslots[i].toString(10);
        }

        return ficha_inicial;
    };

    this.heal = function (heal) {
        let old_hp = this.hp;
		this.hp += heal;
        if (this.hp > this.max_hp) {
			this.hp = this.max_hp;
		}
    };

    this.damage = function (dmg) {
        var dmge = dmg;
        dmg -= this.hp_temp;
        this.hp_temp -= dmge;
        if (this.hp_temp < 0)
            this.hp_temp = 0;

        this.hp -= dmg;
    };

    this.add_hp_temp = function (heal) {
        this.hp_temp += heal;
    };

    this.reset_hp_temp = function () {
        this.hp_temp = 0;
    };

    this.set_max_hp = function (new_hp) {
        this.max_hp = new_hp;
        if (this.hp > this.max_hp) {
            this.hp = this.max_hp;
        }
    };

    this.set_spell = function (level, new_value) {
        this.spellslots[level] = new_value;
    }

    this.spend_spell = function (level, value_spent) {
        if (this.spellslots[level] > 0)
            this.spellslots[level] -= value_spent;
    }

	this.xper = function(xp) {
		this.xp += xp;
		if (this.xp > this.max_xp) {
			this.xp -= this.max_xp;
			this.level += 1;
			this.max_xp = this.xp_chart[this.level];
		}
    };
};

// Character Manager ----------------------------------

var character_list = {

};

var get_character_list = function(id) {
	return character_list[id];
};

var create_character = function (name, race, game_class, hp, max_hp, level, xp, player) {
    if (!(level in xp_chart))
        return null;
    character_list[player] = new character(name, race, game_class, hp, max_hp, level, xp);
	return character_list[player];
}

var get_ficha = function (player) {
    if (!(player in character_list))
        return null;

	return character_list[player].ficha();
}

var heal_char = function(heal, player) {
    if (!(player in character_list))
        return null;

	character_list[player].heal(heal);
    return [character_list[player].hp, character_list[player].max_hp, character_list[player].hp_temp];
}

var damage_char = function (dmg, player) {
    if (!(player in character_list))
        return null;

    character_list[player].damage(dmg);
    return [character_list[player].hp, character_list[player].max_hp, character_list[player].hp_temp];
}

var xp_char = function(xp, player) {
    if (!(player in character_list))
        return null;

	character_list[player].xper(xp);
    return [character_list[player].xp, character_list[player].max_xp, character_list[player].level];
}

var set_hp_char = function (new_hp, player) {
    if (!(player in character_list))
        return null;

    character_list[player].set_max_hp(new_hp);
    return [character_list[player].hp, character_list[player].max_hp, character_list[player].hp_temp];
}

var add_hp_char = function (hp, player) {
    if (!(player in character_list))
        return null;

    character_list[player].add_hp_temp(hp);
    return [character_list[player].hp, character_list[player].max_hp, character_list[player].hp_temp];
}

var reset_hp_char = function (player) {
    if (!(player in character_list))
        return null;

    character_list[player].reset_hp_temp();
    return [character_list[player].hp, character_list[player].max_hp, character_list[player].hp_temp];
}

var set_spell_char = function (level, amount, player) {
    if (!(player in character_list))
        return null;
    if (level < 0 || level > 9)
        return null;

    character_list[player].set_spell(level, amount);
    return [character_list[player].spellslots];
}

var spend_spell_char = function (level, value_spent, player) {
    if (!(player in character_list))
        return null;
    if (level < 0 || level > 9)
        return null;

    character_list[player].spend_spell(level, value_spent);
    return [character_list[player].spellslots];
}

var verify_and_send = function (the_func, player, var_1, var_2) {
    if (!(player in character_list))
        return null;

    the_func();
    return var_1.toString(10) + "/" + var_2.toString(10);
}

	


// Exports
module.exports.get_character_list = get_character_list;
module.exports.create_character = create_character;
module.exports.get_ficha = get_ficha;
module.exports.heal_char = heal_char;
module.exports.damage_char = damage_char;
module.exports.xp_char = xp_char;
module.exports.set_hp_char = set_hp_char;
module.exports.add_hp_char = add_hp_char;
module.exports.reset_hp_char = reset_hp_char;
module.exports.set_spell_char = set_spell_char;
module.exports.spend_spell_char = spend_spell_char;
module.exports.character = character;
