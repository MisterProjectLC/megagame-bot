// character_manager.js

// Character ------------------------------

var command = function(name, description, func) {
    this.name = name;
    this.description = description;
    this.func = func;

    this.ficha = function () {
    };
};

	


// Exports
module.exports.command = command;
