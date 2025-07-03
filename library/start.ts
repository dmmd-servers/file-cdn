// Imports
import chalk from "chalk";
import cdn from "./cdn";
import project from "./project";
import audit from "../bunsvr/audit";

// Defines starting methods
export async function ensureCDN(): Promise<void> {
    // Ensures directory
    audit("cdn", "Ensuring CDN directory...", chalk.yellow, project.log);
    const ensured = await cdn.ensure();
    if(ensured) audit("files", "CDN directory automatically created!", chalk.yellow, project.log);
    else audit("cdn", "CDN directory detected!", chalk.green, project.log);
}

// Exports
export default {
    ensureCDN
};
