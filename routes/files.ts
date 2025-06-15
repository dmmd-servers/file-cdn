// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(?:file|fil|f)\/(.*)$/);
    if(target === null) throw new faults.RouteAbort();

    // Resolves file
    const filepath = nodePath.resolve(direct.files, target[1]!);
    if(!filepath.startsWith(direct.files)) throw new faults.MissingEndpoint();
    const file = Bun.file(filepath);
    if(!(await file.exists())) throw new faults.MissingEndpoint();
    return new Response(file);
}

// Exports
export default route;
