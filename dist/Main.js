import { Router } from "./Router";
export class Main {
    constructor() {
        this.router = new Router();
        console.log(`Constructored new Instance of the program`);
    }
    launchApp() {
        this.router.handleRequest();
    }
}
new Main().launchApp();
//# sourceMappingURL=Main.js.map