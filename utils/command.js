// character_manager.js

// Character ------------------------------

class command {
    constructor(name, description, func) {
        this.name = name;
        this.description = description;
        this.func = func;
    }
}

// Exports
module.exports.command = command;
