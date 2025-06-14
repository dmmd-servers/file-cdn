// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(?:directory|d)\/(.*)$/);
    if(target === null) throw new faults.RouteAbort();

    // Resolves directory
    try {
        const dirpath = nodePath.resolve(direct.files, target[1]!);
        const files = await nodeFile.readdir(dirpath);
        return Response.json(files);
        // const file = Bun.file(filepath);
        // if(!(await file.exists())) throw new faults.MissingEndpoint();
        // return new Response(file);
    }
    catch {
        throw new faults.MissingEndpoint();
    }
}

// Exports
export default route;
