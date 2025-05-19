// Imports
import bunSqlite from "bun:sqlite";
import nodeCrypto from "node:crypto";
import nodeFile from "node:fs/promises";
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
        ORDER BY creation_time ASC
        LIMIT ? OFFSET ?
    `).all(size, size * page) as TokenSchema[];
    const tokens = schemas.map((schema) => toToken(schema));
    return tokens;
}
export function testToken(value: string): 0 | 1 {
    // Fetches token
    const schema = database.query(`
        SELECT EXISTS(SELECT 1 FROM tokens WHERE token_value = ?) AS test_value
    `).get(value) as {
        test_value: 0 | 1
    };
    return schema.test_value;
}
export function fetchToken(value: string): Token {
    // Fetches token
    const schema = database.query(`
        SELECT token_value, token_scopes, creation_time, expiration_time FROM tokens
        WHERE token_value = ?
    `).get(value) as TokenSchema | null;
    if(schema === null) throw new except.UnknownToken();
    const token = toToken(schema);
    return token;
}
export function generateToken(scopes: string[], life: number): Token {
    // Generates token
    const token: Token = {
        scopes: Array.from(new Set(scopes)),
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
export function revokeToken(value: string): void {
    // Revokes token
    const original = fetchToken(value);
    database.run(`
        DELETE FROM tokens
        WHERE token_value = ?
    `, [ original.value ]);
}
export function permitTokenScopes(value: string, scopes: string[]): Token {
    // Updates token
    const original = fetchToken(value);
    const updated: Token = {
        scopes: Array.from(new Set([ ...original.scopes, ...scopes ])),
        creation: original.creation,
        expiration: original.expiration,
        value: original.value
    };
    const schema = toTokenSchema(updated);
    database.run(`
        UPDATE tokens
        SET token_scopes = ?
        WHERE token_value = ?
    `, [ schema.token_scopes, schema.token_value ]);
    return updated;
}
export function forbidTokenScopes(value: string, scopes: string[]): Token {
    // Updates token
    const original = fetchToken(value);
    const updated: Token = {
        scopes: Array.from(new Set(original.scopes.filter((scope) => !scopes.includes(scope)))),
        creation: original.creation,
        expiration: original.expiration,
        value: original.value
    };
    const schema = toTokenSchema(updated);
    database.run(`
        UPDATE tokens
        SET token_scopes = ?
        WHERE token_value = ?
    `, [ schema.token_scopes, schema.token_value ]);
    return updated;
}
export function renewTokenAccess(value: string, life: number): Token {
    // Updates token
    const original = fetchToken(value);
    const updated: Token = {
        creation: original.creation,
        expiration: Date.now() + life,
        scopes: original.scopes,
        value: original.value
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
export async function listContents(
    scope: string,
    value: string,
    target: string
): Promise<string[]> {
    // Validates token
    const token = fetchToken(value);
    if(!token.scopes.includes(scope)) throw new except.UnauthorizedToken();
    
    // Lists directory
    const scopePath = nodePath.resolve(project.root, `./contents/${scope}/`);
    const dirpath = nodePath.resolve(scopePath, target);
    if(!dirpath.startsWith(scopePath)) throw new except.UnknownEndpoint();
    const stat = await nodeFile.stat(dirpath);
    if(!stat.isDirectory()) throw new except.PathNotDirectory();
    const list = await nodeFile.readdir(dirpath);
    return list;
}
export async function testContent(
    scope: string,
    value: string,
    target: string
): Promise<0 | 1 | 2> {
    // Validates token
    const token = fetchToken(value);
    if(!token.scopes.includes(scope)) throw new except.UnauthorizedToken();
    
    // Tests content
    const scopePath = nodePath.resolve(project.root, `./contents/${scope}/`);
    const contentPath = nodePath.resolve(scopePath, target);
    if(!contentPath.startsWith(scopePath)) throw new except.UnknownEndpoint();
    const stat = await nodeFile.stat(contentPath);
    if(stat.isDirectory()) return 2;
    else if(stat.isFile()) return 1;
    else return 0;
}
export async function fetchContent(
    scope: string,
    value: string,
    target: string
): Promise<ArrayBuffer> {
    // Validates token
    const token = fetchToken(value);
    if(!token.scopes.includes(scope)) throw new except.UnauthorizedToken();
    
    // Fetches content
    const scopePath = nodePath.resolve(project.root, `./contents/${scope}/`);
    const filepath = nodePath.resolve(scopePath, target);
    if(!filepath.startsWith(scopePath)) throw new except.UnknownEndpoint();
    const stat = await nodeFile.stat(filepath);
    if(!stat.isFile()) throw new except.PathNotFile();
    const file = Bun.file(filepath);
    return await file.arrayBuffer();
}
export async function createContent(
    scope: string,
    value: string,
    target: string,
    content: ArrayBuffer | null
): Promise<void> {
    // Validates token
    if(value !== project.admin) throw new except.UnauthorizedToken();
    
    // Fetches content
    const scopePath = nodePath.resolve(project.root, `./contents/${scope}/`);
    const contentPath = nodePath.resolve(scopePath, target);
    if(!contentPath.startsWith(scopePath)) throw new except.UnknownEndpoint();
    if(contentPath === scopePath) throw new except.PathIsScope();
    const stat = await nodeFile.stat(contentPath);
    if(stat.isDirectory() || stat.isFile()) throw new except.PathAlreadyExists();
    if(content === null) nodeFile.mkdir(contentPath);
    else Bun.write(contentPath, content);
}
export async function deleteContent(
    scope: string,
    value: string,
    target: string
): Promise<void> {
    // Validates token
    if(value !== project.admin) throw new except.UnauthorizedToken();
    
    // Fetches content
    const scopePath = nodePath.resolve(project.root, `./contents/${scope}/`);
    const contentPath = nodePath.resolve(scopePath, target);
    if(!contentPath.startsWith(scopePath)) throw new except.UnknownEndpoint();
    if(contentPath === scopePath) throw new except.PathIsScope();
    const stat = await nodeFile.stat(contentPath);
    if(!stat.isDirectory() && !stat.isFile()) throw new except.PathDoesNotExist();
    nodeFile.rm(contentPath, {
        force: true,
        recursive: true
    });
}

// Defines scope handler
export async function listScopes(values: string[]): Promise<string[]> {
    // Lists scopes
    const contentsPath = nodePath.resolve(project.root, "./contents/");
    const scopes = await nodeFile.readdir(contentsPath);
    const cache: Set<string> = new Set(fetchToken("").scopes);
    for(let i = 0; i < values.length; i++) {
        const value = values[i]!;
        if(value === project.admin) return scopes;
        try {
            const token = fetchToken(value);
            for(let j = 0; j < token.scopes.length; j++) {
                const scope = token.scopes[j]!;
                cache.add(scope);
            }
        }
        catch {
            continue;
        }
    }
    const list = Array.from(cache).filter((scope) => scopes.includes(scope));
    return list;
}
export async function createScope(scope: string, value: string): Promise<void> {

}
export async function deleteScope(scope: string, value: string): Promise<void> {

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
