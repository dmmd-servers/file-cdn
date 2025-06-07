// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import * as project from "../core/project";
import AbortFault from "../faults/abort-fault";

// Defines static route function
export async function staticRoute(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(.+)$/);
    if(target === null) throw new AbortFault();

    // Parses static
    try {
        // Resolves static
        const filepath = nodePath.resolve(project.rootPath, "./static/", target[1]!);
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
export default staticRoute;
