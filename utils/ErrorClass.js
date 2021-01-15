const { Error } = require("mongoose");

class ErrorClass extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ErrorClass;