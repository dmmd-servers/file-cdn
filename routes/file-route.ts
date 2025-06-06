// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import * as project from "../core/project";
import AbortFault from "../faults/abort-fault";

// Defines file route function
export async function fileRoute(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(?:file|f)\/(.+)$/);
    if(target === null) throw new AbortFault();

    // Parses file
    try {
        // Resolves file
        const filepath = nodePath.resolve(project.rootPath, "./files/", target[1]!);
        const stat = await nodeFile.stat(filepath);
        if(!stat.isFile()) throw new AbortFault();
        const file = Bun.file(filepath);
        return new Response(file);
    }
    catch {
        // Throws fault
        throw new AbortFault();
    }
}

// Exports
export default fileRoute;
