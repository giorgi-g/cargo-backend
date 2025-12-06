import { CommandFactory } from "nest-commander";
import { AppModule } from "./app.module";

async function bootstrapConsole() {
    await CommandFactory.run(AppModule, ["error", "warn"]);
}

bootstrapConsole()
    .then(async (app) => {
        console.info("command bootstrapped ...!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("server failed to start command", err);
        process.exit(1);
    })
    .finally(() => {
        console.info("command finished ...!");
    });
