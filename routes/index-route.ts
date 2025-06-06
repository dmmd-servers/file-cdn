// Imports
import chalk from "chalk";
import audit from "../core/audit";
import AbortFault from "../faults/abort-fault";
import GenericFault from "../faults/generic-fault";
import NoEndpointFault from "../faults/no-endpoint-fault";
import ServerFault from "../faults/server-fault";
import assetsRoute from "./assets-route";
import fileRoute from "./file-route";
import staticRoute from "./static-route";

// Defines routes
const routes = [
    assetsRoute,
    staticRoute,
    fileRoute
];

// Defines index route function
export async function indexRoute(request: Request, server: Bun.Server): Promise<Response> {
    // Creates router
    try {
        // Resolves routes
        for(let i = 0; i < routes.length; i++) {
            // Attempts route
            const route = routes[i]!;
            try {
                // Creates response
                const response = await route(request, server);
                return response;
            }
            catch(thrown) {
                // Ignores abort fault
                if(thrown instanceof AbortFault) continue;

                // Throws fault
                throw thrown;
            }
        }

        // Throws fault
        throw new NoEndpointFault();
    }
    catch(thrown) {            
        // Creates fallback response
        const fault = thrown instanceof GenericFault ? thrown : new ServerFault();
        const error = thrown instanceof Error ? thrown : new Error(String(thrown));
        const response = Response.json({
            code: fault.code,
            message: fault.message
        }, fault.status);
        
        // Audits thrown
        if(thrown instanceof GenericFault) {
            const body = `${fault.message} (${fault.code})`;
            audit("fault", body, chalk.red);
        }
        else {
            const body = `${error.message} (${error.name})`;
            audit("error", body, chalk.red);
        }

        // Returns response
        return response;
    }
}

// Exports
export default indexRoute;
