export abstract class BaseController {
    protected container = document.createElement("div");
   
    protected createElement<K extends keyof HTMLElementTagNameMap>(
        elementType: K, innerText?: string, action?:any
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(elementType);
        if (innerText) {
            element.innerText = innerText;
        }
        if(action) {
            element.onclick = action;

        }
        this.container.append(element)
        return element;
    }
}