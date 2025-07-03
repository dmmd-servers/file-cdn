// Imports
import nodePath from "node:path";
import project from "./project";

// Defines paths
export const assets = nodePath.resolve(project.basepath, "./assets/");
export const cdn = nodePath.resolve(project.basepath, "./cdn");
export const contents = nodePath.resolve(project.basepath, "./static/");
export const root = project.basepath;

// Exports
export default {
    assets,
    cdn,
    contents,
    root
};
