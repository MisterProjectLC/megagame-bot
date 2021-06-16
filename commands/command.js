// character_manager.js

// Character ------------------------------

class command {
    constructor(name, description, func, permission_func) {
        this.name = name;
        this.description = description;
        this.func = func;
        this.permission_func = permission_func;
    }
}

// Exports
module.exports.command = command;
