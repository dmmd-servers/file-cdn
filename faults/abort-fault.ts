// Imports
import GenericFault from "./generic-fault";

// Defines abort fault class
export class AbortFault extends GenericFault {
    // Defines constructor
    readonly code: string = "ABORT_FAULT";
    readonly message: string = "Procedure aborted.";
    readonly status: number = 500;
}

// Exports
export default AbortFault;
