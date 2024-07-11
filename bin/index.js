#!/usr/bin/env node

import App from "../src/app.js";

const app = new App()
await app.init();
app.run();
