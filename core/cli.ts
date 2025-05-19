// Imports
import * as api from "./api";

// Defines commands
// type Command = {
//     pattern: (action: string, parameters: string[]) => boolean | Promise<boolean> | RegExp | string;
//     resolve: (action: string, parameters: string[]) => void | Promise<void>;
// };
// const commands: Command[] = [
//     {}
// ]

// // Parses argument vector
// const vector = process.argv.slice(2);
// if(vector.length === 0) {
//     printManual();
// }

// api.generateToken([], 24 * 60 * 60 * 1000);
function printTokens(size: number, page: number): void {
    // Defines formatters
    const formatScopes = (scopes: readonly string[]): string => {
        // Formats text
        const list = scopes.map((scope) => `${scope}/`).join(", ");
        const truncated = list.length > 30 ? list.slice(0, 27) : list;
        return truncated;
    };
    const formatDate = (time: number): string => {
        // Formats text
        const date = new Date(time);
        if(isNaN(date.getTime())) return "Never";
        const year = date.getFullYear().toString().padStart(4, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = (date.getHours() % 12 || 12).toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        const meridian = date.getHours() < 12 ? "AM" : "PM";
        const stamp = `${year}/${month}/${day} ${hours}:${minutes}:${seconds} ${meridian}`;
        return stamp;
    };
    const formatToken = (token: api.Token): string[] => {
        // Formats row
        const row = [
            token.value,
            formatScopes(token.scopes),
            formatDate(token.creation),
            formatDate(token.expiration) + (Date.now() > token.expiration ? " (Expired)" : "")
        ];
        return row;
    }

    // Creates table
    const universal = api.fetchToken("");
    const tokens = api.listTokens(size, page);
    const table: string[][] = [
        [ "Token", "Scopes", "Creation", "Expiration" ],
        formatToken(universal),
        ...tokens.map((token) => formatToken(token))
    ];

    // Renders table
    const padding = table.reduce((length, row) => {
        // Parses padding
        return length.map((value, index) => Math.max(value, Bun.stringWidth((row[index] ?? ""))));
    }, [ 0, 0, 0, 0 ]);
    const render = table.map((row) => {
        // Formats row
        return `| ${row.map((value, index) => value.padEnd(padding[index] ?? 0, " ")).join(" | ")} |`;
    }).join("\n");
    console.log(render);
}
printTokens(10, 0);