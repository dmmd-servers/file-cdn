// Imports
import * as api from "./core/api";

// const token = api.generateToken([], 24 * 60 * 60 * 1000);
// console.log(token);

const tokens = api.listTokens(10, 0);
console.log(tokens);

const pubtoken = api.testToken("a");
console.log(pubtoken);

// const token = tokens[0]!;
// console.log(token);

// const updated = api.permitTokenAccess(token, [ "hello" ]);
// console.log(updated);
