// Defines abstract exception
export abstract class Exception extends Error {
    // Declares fields
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
}

// Defines exceptions
export class DebugException extends Exception {
    // Defines and declares fields
    readonly code = "DEBUG_EXCEPTION";
    readonly message: string;
    readonly status = 500;

    // Defines constructor
    constructor(message: string) {
        // Initializes instance
        super();
        this.message = message;
    }
}
export class PathAlreadyExists extends Exception {
    // Defines fields
    readonly code = "PATH_ALREADY_EXISTS";
    readonly message = "The path specified already exists.";
    readonly status = 400;
}
export class PathDoesNotExist extends Exception {
    // Defines fields
    readonly code = "PATH_DOES_NOT_EXIST";
    readonly message = "The path specified does not exist.";
    readonly status = 400;
}
export class PathIsScope extends Exception {
    // Defines fields
    readonly code = "PATH_IS_SCOPE";
    readonly message = "The path specified is a scope.";
    readonly status = 400;
}
export class PathNotDirectory extends Exception {
    // Defines fields
    readonly code = "PATH_NOT_DIRECTORY";
    readonly message = "The path specified is not a directory.";
    readonly status = 400;
}
export class PathNotFile extends Exception {
    // Defines fields
    readonly code = "PATH_NOT_FILE";
    readonly message = "The path specified is not a file.";
    readonly status = 400;
}
export class UnauthorizedToken extends Exception {
    // Defines fields
    readonly code = "UNAUTHORIZED_TOKEN";
    readonly message = "The token provided is not authorized.";
    readonly status = 401;
}
export class UnknownEndpoint extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_ENDPOINT";
    readonly message = "The endpoint that you requested does not exist.";
    readonly status = 404;
}
export class UnknownException extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_EXCEPTION";
    readonly message = "An unknown exception has occurred.";
    readonly status = 500;
}
export class UnknownToken extends Exception {
    // Defines fields
    readonly code = "UNKNOWN_TOKEN";
    readonly message = "The token provided is not available.";
    readonly status = 404;
}
