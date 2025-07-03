// Imports
import nodeFile from "node:fs/promises";
import paths from "./paths";
import grab from "../bunsvr/grab";
import faults from "./faults";

// Defines ensurer
export async function ensure(): Promise<boolean> {
    // Ensures directory
    try {
        await nodeFile.mkdir(paths.cdn);
        return true;
    }
    catch {
        return false;
    }
}

// Defines resolvers
export async function directory(dirpath: string): Promise<string[]> {
    const resolved = await grab.resolveDirectory(dirpath, paths.cdn);
    if(resolved === null) throw new faults.MissingDirectory();
    return resolved;
}
export async function file(filepath: string): Promise<Bun.BunFile> {
    const resolved = await grab.resolveFile(filepath, paths.cdn);
    if(resolved === null) throw new faults.MissingFile();
    return resolved;
}

// Exports
export default {
    directory,
    ensure,
    file
};
