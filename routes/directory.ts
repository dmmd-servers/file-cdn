// Imports
import nodeFile from "node:fs/promises";
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(?:directory|dir|d)\/(.*)$/);
    if(target === null) throw new faults.RouteAbort();
    
    // Resolves directory
    try {
        const dirpath = nodePath.resolve(direct.files, target[1]!);
        const children = await nodeFile.readdir(dirpath);
        const items = await Promise.all(children.map(async (child) => {
            const stat = await nodeFile.stat(nodePath.resolve(dirpath, child));
            return stat.isFile() ? child : (child + "/");
        }));
        if(dirpath !== direct.files) items.push("../");
        items.sort((left, right) => (+right.endsWith("/") - +left.endsWith("/")) || left.localeCompare(right));
        return Response.json(items);
    }
    catch {
        throw new faults.MissingEndpoint();
    }
}

// Exports
export default route;
