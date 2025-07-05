// Imports
import nodePath from "node:path";
import grab from "../bunsvr/grab";
import pack from "../bunsvr/pack";
import faults from "../library/faults";
import paths from "../library/paths";

// Defines route
export async function route(server: Bun.Server, request: Request, url: URL): Promise<Response> {
    // Defines directory api
    if(url.pathname.startsWith("/d")) {
        // Grabs contents
        const dirpath = url.pathname.slice(3);
        const contents = await grab.resolveDirectory(dirpath, paths.cdn);
        if(contents === null) throw new faults.MissingDirectory();

        // Maps directory
        const directory = await Promise.all(contents.map(async (content) => {
            const stat = await Bun.file(nodePath.resolve(paths.cdn, dirpath, content)).stat();
            return stat.isDirectory() ? (content + "/") : content;
        }));
        directory.sort((a, b) => {
            if(a.endsWith("/") && !b.endsWith("/")) return -1;
            if(b.endsWith("/") && !a.startsWith("/")) return 1;
            return a.localeCompare(b);
        });
        return pack.resolveJSON(directory);
    }
    
    // Defines file api
    if(url.pathname.startsWith("/f")) {
        // Grabs file
        const filepath = url.pathname.slice(3);
        const file = await grab.resolveFile(filepath, paths.cdn);
        if(file === null) throw new faults.MissingFile();
        return pack.resolveFile(file);
    }

    // Defines view api
    if(url.pathname.startsWith("/v")) {
        // Grabs viewer
        const viewer = await grab.resolveFile("viewer.html", paths.resources);
        if(viewer === null) throw new faults.ServerFailure();
        return pack.resolveFile(viewer);
    }

    // Handles redirect
    if(url.pathname === "/") return pack.resolveRedirect("/v");

    // Handles fallback
    throw new faults.RouteAbort();
}

// Exports
export default route;
