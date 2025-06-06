// Imports
import GenericFault from "./generic-fault";

// Defines no endpoint fault class
export class NoEndpointFault extends GenericFault {
    // Defines constructor
    readonly code: string = "NO_ENDPOINT_FAULT";
    readonly message: string = "Requested endpoint does not exist.";
    readonly status: number = 404;
}

// Exports
export default NoEndpointFault;
