// Imports
import listen from "./bunsvr/listen";
import pack from "./bunsvr/pack";
import inspect from "./library/inspect";
import project from "./library/project";
import router from "./library/router";

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
const server = listen(
    // Port
    project.port,

    // Pre-processor
    async (server, request) => {
        const ping = inspect.inspectPing(server, request);
        return ping;
    },

    // Router
    router,

    // Error handler
    async (server, request, thrown) => {
        const fault = inspect.inspectFault(server, request, thrown);
        const response = pack.resolveFault(fault);
        return response;
    },

    // Post-processor
    async (server, request, response) => {
        const access = inspect.inspectAccess(server, request, response);
        return access;
    }
);
inspect.inspectServer(server);
