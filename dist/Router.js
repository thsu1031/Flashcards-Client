export class Router {
    handleRequest() {
        console.log(`Handling request for : ${this.getRoute()}`);
    }
    getRoute() {
        return window.location.pathname;
    }
}
//# sourceMappingURL=Router.js.map