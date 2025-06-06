// Imports
import nodePath from "node:path";

// Defines root
export const rootPath = nodePath.resolve(import.meta.dir, "../");

// Defines env
export const port = +(process.env.PORT ?? "3000");
