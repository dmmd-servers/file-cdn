// Imports
<<<<<<< HEAD
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
=======
import grab from "../bunsvr/grab";
import pack from "../bunsvr/pack";
import faults from "../library/faults";
import paths from "../library/paths";

// Defines route
export async function route(server: Bun.Server, request: Request, url: URL): Promise<Response> {
    // Checks pathname
    if(url.pathname !== "/") throw new faults.RouteAbort();

    // Returns page
    const file = await grab.resolveFile("html/index.html", paths.assets);
    if(file === null) throw new faults.RouteAbort();
    return pack.resolveFile(file);
>>>>>>> 2ce064b04380583d54016be4fa79595e0b45bd41
}

// Exports
export default route;
