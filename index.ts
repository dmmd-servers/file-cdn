// Imports
import nodeFile from "node:fs/promises";
import chalk from "chalk";
import access from "./core/access";
import audit from "./core/audit";
import direct from "./core/direct";
import project from "./core/project";

// Ensures files directory
try {
    audit("files", "Ensuring files directory...", chalk.yellow);
    await nodeFile.mkdir(direct.files);
    audit("files", "Files directory automatically created!", chalk.yellow);
}
catch {
    audit("files", "Files directory detected!", chalk.green);
}

// Creates server
const server = Bun.serve({
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
