// Imports
import nodePath from "node:path";

// Defines root path
export const root = nodePath.resolve(import.meta.dir, "../");

// Defines relative paths
export const files = nodePath.resolve(root, "./files/");
export const contents = nodePath.resolve(root, "./static/");

// Exports
export default {
    contents,
    files,
    root
};
