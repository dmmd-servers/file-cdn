// Imports
import chalk from "chalk";
import access from "./access";
import audit from "./audit";
import * as project from "./project";

// Creates server
export const server = Bun.serve({
    development: false,
    fetch: async (request) => {
        // Creates response
        const response = await access(request, server);
        return response;
    },
    port: project.port
});

// Audits server
const url = `http://localhost:${project.port}/`;
const body = `Server is now listening on ${chalk.cyan(url)}.`;
audit("server", body, chalk.green);

// Exports
export default server;
