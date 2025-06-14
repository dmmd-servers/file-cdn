// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/$/);
    if(target === null) throw new faults.RouteAbort();

    // Resolves home
    const filepath = nodePath.resolve(direct.root, "./assets/html/index.html");
    const file = Bun.file(filepath);
    return new Response(file);
}

// Exports
export default route;
