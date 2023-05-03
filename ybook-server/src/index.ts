import { startServer } from "./server";

startServer();

process.on("uncaughtException", (error) => {
  console.error("CRITICAL: UNCAUGHT ERROR");
  console.error(error);
});
