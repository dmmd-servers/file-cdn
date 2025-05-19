// Imports
import * as api from "./core/api";
import * as project from "./core/project";

await api.createScope("public", project.admin);