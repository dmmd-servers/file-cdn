// Imports
import chalk from "chalk";
import audit from "./audit";
import indexRoute from "../routes/index-route";

// Defines access function
export async function access(request: Request, server: Bun.Server): Promise<Response> {
    // Creates response
    const response = await indexRoute(request, server);
    
    // Audits access
    const url = new URL(request.url);
    const ip = request.headers.get("CF-Connecting-IP") ?? server.requestIP(request)?.address ?? "unknown";
    const endpoint = `${request.method} ${url.pathname + url.search}`;
    const status = `${response.status} ${response.ok ? "OK" : "FAILED"}`;
    const body = `${chalk.cyan(ip)} accessed ${chalk.cyan(endpoint)}. (${status})`;
    const style = response.ok ? chalk.green : chalk.red;
    audit("access", body, style);

    // Returns response
    return response;
}

// Exports
export default access;
