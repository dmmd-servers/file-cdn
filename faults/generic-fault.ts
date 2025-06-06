// Defines generic fault class
export abstract class GenericFault extends Error {
    // Defines constructor
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
    readonly name: string = "Fault";
}

// Exports
export default GenericFault;
