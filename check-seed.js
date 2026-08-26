"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var seed_1 = require("@repo/db/seed");
console.log("Before seed");
await (0, seed_1.seed)();
console.log("After seed");
