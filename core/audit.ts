// Imports
import chalk from "chalk";
<<<<<<< HEAD

// Defines out sink
const out = Bun.stdout.writer();

// Defines audit function
export function audit(head: string, body: string, style: typeof chalk): void {
    // Calculates zone
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const direction = offset > 0 ? "-" : "+";
    const major = Math.trunc(Math.abs(offset) / 60).toString().padStart(2, "0");
    const minor = (Math.abs(offset) % 60).toString().padStart(2, "0");
    const zone = `UTC${direction}${major}${minor}`;
=======
import project from "./project";

// Defines audit function
export function audit(head: string, body: string, style: typeof chalk): void {
    // Fetches now
    const now = new Date();

    // Calculates zone
    const offset = now.getTimezoneOffset();
    const polarity = offset > 0 ? "-" : "+";
    const major = Math.trunc(Math.abs(offset) / 60).toString().padStart(2, "0");
    const minor = (Math.abs(offset) % 60).toString().padStart(2, "0");
    const zone = `UTC${polarity}${major}${minor}`;
>>>>>>> d7396d9a2ed6de84c854bfe6d59cefc95becfc72

    // Calculates date
    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    // Calculates time
    const hour = (now.getHours() % 12 || 12).toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    const millisecond = now.getMilliseconds().toString().padStart(3, "0");
    const meridian = now.getHours() < 12 ? "AM" : "PM";
    const time = `${hour}:${minute}:${second}.${millisecond} ${meridian}`;
    
<<<<<<< HEAD
    // Creates message
    const message = style(`[${zone} ${date} ${time}] ${head.toUpperCase()} | ${body}\n`);
    out.write(message);
=======
    // Writes message
    const message = style(`[${zone} ${date} ${time}] ${head.toUpperCase()} | ${body}\n`);
    project.log.write(message);
>>>>>>> d7396d9a2ed6de84c854bfe6d59cefc95becfc72
}

// Exports
export default audit;
