// Imports
import nodePath from "node:path";
import * as audit from "./audit";
import * as except from "./except";
import * as project from "./project";

// Defines routes
export type Pattern = ((request: Request, server: Bun.Server) => boolean | Promise<boolean>) | RegExp | string;
export type Resolve = (request: Request, server: Bun.Server) => (Response | null) | Promise<Response | null>;
export type Route = {
    pattern: Pattern;
    resolve: Resolve;
};
export const routes: Route[] = [
    {
        pattern: "/",
        resolve: async () => {
            // Resolves index.html
            const filepath = nodePath.resolve(project.root, "./assets/html/index.html");
            const file = Bun.file(filepath);
            if(!(await file.exists())) return null;
            audit.logMessage("Hello, world!");
            return new Response(file);
        }
    },
    {
        pattern: /^\/assets\/*/,
        resolve: async (request) => {
            // Resolves assets
            const url = new URL(request.url);
            const dirpath = nodePath.resolve(project.root, "./assets/");
            const filepath = nodePath.resolve(dirpath, url.pathname.split("/").slice(2).join("/"));
            if(!filepath.startsWith(dirpath)) return null;
            const file = Bun.file(filepath);
            if(!(await file.exists())) return null;
            return new Response(file);
        }
    },
    {
        pattern: /^\/*/,
        resolve: async (request) => {
            // Resolves static
            const url = new URL(request.url);
            const dirpath = nodePath.resolve(project.root, "./static/");
            const filepath = nodePath.resolve(dirpath, url.pathname.split("/").slice(1).join("/"));
            if(!filepath.startsWith(dirpath)) return null;
            const file = Bun.file(filepath);
            if(!(await file.exists())) return null;
            return new Response(file);
        }
    }
];
