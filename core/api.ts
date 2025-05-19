// Imports
import bunSqlite from "bun:sqlite";
import nodeCrypto from "node:crypto";
import nodePath from "node:path";
import * as audit from "./audit";
import * as except from "./except";
import * as project from "./project";

// Initializes database
export const database = bunSqlite.open(nodePath.resolve(project.root, "./database.sqlite"));

// Defines token handlers
export type TokenSchema = Readonly<{
    token_value: string;
    token_scopes: string;
    creation_time: number;
    expiration_time: number;
}>;
export type Token = Readonly<{
    creation: number;
    expiration: number;
    scopes: readonly string[];
    value: string;
}>;
export function listTokens(size: number, page: number): Token[] {
    // Lists tokens
    const schemas = database.query(`
        SELECT token_value, token_scopes, creation_time, expiration_time FROM tokens
        WHERE token_value <> ""
        ORDER BY creation_time asc
        LIMIT ? OFFSET ?
    `).all(size, size * page) as TokenSchema[];
    const tokens = schemas.map((schema) => toToken(schema));
    return tokens;
}
export function fetchToken(value: string): Token {
    // Fetches token
    const schema = database.query(`
        SELECT token_value, token_scopes, creation_time, expiration_time FROM tokens
        WHERE token_value = ?
    `).get(value) as TokenSchema;
    const token = toToken(schema);
    return token;
}
export function generateToken(access: string[], life: number): Token {
    // Generates token
    const token: Token = {
        scopes: Array.from(new Set(access)),
        creation: Date.now(),
        expiration: Date.now() + life,
        value: nodeCrypto.randomBytes(64).toBase64()
    };
    const schema = toTokenSchema(token);
    database.run(`
        INSERT INTO tokens (token_value, token_scopes, creation_time, expiration_time)
        VALUES (?, ?, ?, ?)
    `, [ schema.token_value, schema.token_scopes, schema.creation_time, schema.expiration_time ]);
    return token;
}
export function revokeToken(token: Token): void {
    // Revokes token
    database.run(`
        DELETE FROM tokens
        WHERE token_value = ?
    `, [ token.value ]);
}
export function permitTokenAccess(token: Token, access: string[]): Token {
    // Updates token
    const updated: Token = {
        scopes: Array.from(new Set([ ...token.scopes, ...access ])),
        creation: token.creation,
        expiration: token.expiration,
        value: token.value
    };
    const schema = toTokenSchema(updated);
    database.run(`
        UPDATE tokens
        SET token_scopes = ?
        WHERE token_value = ?
    `, [ schema.token_scopes, schema.token_value ]);
    return updated;
}
export function forbidTokenAccess(token: Token, access: string[]): Token {
    // Updates token
    const updated: Token = {
        scopes: Array.from(new Set(token.scopes.filter((token) => !access.includes(token)))),
        creation: token.creation,
        expiration: token.expiration,
        value: token.value
    };
    const schema = toTokenSchema(updated);
    database.run(`
        UPDATE tokens
        SET token_scopes = ?
        WHERE token_value = ?
    `, [ schema.token_scopes, schema.token_value ]);
    return updated;
}
export function renewTokenAccess(token: Token, life: number): Token {
    // Updates token
    const updated: Token = {
        scopes: token.scopes,
        creation: token.creation,
        expiration: Date.now() + life,
        value: token.value
    };
    const schema = toTokenSchema(updated);
    database.run(`
        UPDATE tokens
        SET expiration_time = ?
        WHERE token_value = ?
    `, [ schema.expiration_time, schema.token_value ]);
    return updated;
}
export function toTokenSchema(token: Token): TokenSchema {
    // Converts to schema
    const schema: TokenSchema = {
        creation_time: token.creation,
        expiration_time: token.expiration,
        token_scopes: token.scopes.join(","),
        token_value: token.value
    };
    return schema;
}
export function toToken(schema: TokenSchema): Token {
    // Converts to token
    const token: Token = {
        scopes: schema.token_scopes.length === 0 ? [] : schema.token_scopes.split(","),
        creation: schema.creation_time,
        expiration: schema.expiration_time,
        value: schema.token_value
    };
    return token;
}

// Defines content handler
export async function listContents(scope: string, token: Token, target: string): Promise<string[]> {

}
export async function fetchContent(scope: string, token: Token, target: string): Promise<ArrayBuffer> {

}
export async function createContent(scope: string, target: string, content: ArrayBuffer): Promise<void> {

}
export async function deleteContent(scope: string, target: string): Promise<void> {
    
}

// Defines scope handler
export async function listScopes(token: Token[]): Promise<string[]> {

}
export async function createScope(scope: string): Promise<void> {

}
export async function deleteScope(scope: string): Promise<void> {

}

// Initializes database
database.run(`
    CREATE TABLE IF NOT EXISTS tokens (
        token_value TEXT PRIMARY KEY,
        token_scopes TEXT NOT NULL,
        creation_time INTEGER NOT NULL,
        expiration_time INTEGER NOT NULL
    )
`);
database.run(`
    INSERT OR IGNORE INTO tokens
    VALUES (?, ?, ?, ?)
`, [ "", "", Date.now(), Number.MAX_SAFE_INTEGER ]);
audit.logDatabase("Successfully initialized the database.");
