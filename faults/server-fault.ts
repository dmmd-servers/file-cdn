// Imports
import GenericFault from "./generic-fault";

// Defines server fault class
export class ServerFault extends GenericFault {
    // Defines constructor
    readonly code: string = "SERVER_FAULT";
    readonly message: string = "Internal error occurred.";
    readonly status: number = 500;
}

// Exports
export default ServerFault;
