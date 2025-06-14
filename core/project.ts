<<<<<<< HEAD
// Imports
import nodePath from "node:path";

// Defines root
export const rootPath = nodePath.resolve(import.meta.dir, "../");

// Defines env
export const port = +(process.env.PORT ?? "3000");
=======
// Defines project constants
export const log = Bun.stdout.writer();
export const port = +(process.env.PORT ?? "3000");
export const router = (await import("../routes/root")).default;

// Exports
export default {
    log,
    port,
    router
};
>>>>>>> d7396d9a2ed6de84c854bfe6d59cefc95becfc72
