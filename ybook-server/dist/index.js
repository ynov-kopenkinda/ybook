"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
(0, server_1.startServer)();
process.on("uncaughtException", (error) => {
    console.error("CRITICAL: UNCAUGHT ERROR");
    console.error(error);
});
//# sourceMappingURL=index.js.map