/**
 * Entrypoint for my kaomoji-api
 *
 * @author Tegar Wijaya Kusuma
 * @date 18 March 2026
 */

import { kaomojiApiApp } from "./src/app";

const PORT = Bun.env.PORT ?? 3000;
const HOSTNAME = Bun.env.HOSTNAME ?? "0.0.0.0";

const app = kaomojiApiApp().listen({ port: PORT, hostname: HOSTNAME });

console.log(`Listening on port ${app.server?.port}`);
