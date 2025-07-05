// Imports
import nodePath from "node:path";
import system from "../bunsvr/system";

// Defines paths
export const assets = nodePath.resolve(system.basepath, "./assets/");
export const cdn = nodePath.resolve(system.basepath, "./cdn");
export const resources = nodePath.resolve(system.basepath, "./resources/");
export const root = system.basepath;

// Exports
export default {
    assets,
    cdn,
    resources,
    root
};
