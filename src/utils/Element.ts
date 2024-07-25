export type ParamEvent = {
    type: string;
    callback: (event: Event) => void;
};

export interface ElemParameters {
    tag: string;
    cssClasses?: string[];
    attributes?: { [key: string]: string };
    content?: string;
    innerHTML?: string;
    event?: ParamEvent;
}

class Element<TTag extends HTMLElement> {
    public readonly node: TTag;

    constructor(parameters: ElemParameters) {
        this.node = document.createElement(parameters.tag) as TTag;
        this.setParams(parameters);
    }

    private setParams(parameters: ElemParameters) {
        if (parameters.hasOwnProperty('cssClasses')) {
            this.setClasses(parameters.cssClasses as string[]);
        }
        if (parameters.hasOwnProperty('attributes')) {
            this.setAttribute(parameters.attributes as { [key: string]: string });
        }
        if (parameters.hasOwnProperty('content')) {
            this.content(parameters.content as string);
        }
        if (parameters.hasOwnProperty('event')) {
            this.addEventListener(parameters.event as ParamEvent);
        }
        if (parameters.hasOwnProperty('innerHTML')) {
            this.innerHTML(parameters.innerHTML as string);
        }
    }

    private setClasses(cssClasses: string[]): void {
        cssClasses.forEach((cssClass) => {
            this.node.classList.add(cssClass);
        });
    }

    private setAttribute(attributes: { [key: string]: string }): void {
        Object.keys(attributes).forEach((key) => {
            this.node.setAttribute(key, attributes[key]);
        });
    }

    private content(content: string) {
        this.node.textContent = content;
    }

    private innerHTML(innerHTML: string) {
        this.node.innerHTML = innerHTML;
    }

    public addEventListener(addedEvent: ParamEvent) {
        this.node.addEventListener(addedEvent.type, addedEvent.callback);
    }

    public removeEventListene(addedEvent: ParamEvent) {
        this.node.removeEventListener(addedEvent.type, addedEvent.callback);
    }

    public cleanAppend(...childNodes: HTMLElement[]) {
        this.node.innerHTML = '';
        this.node.append(...childNodes);
    }

    public append(...childNodes: HTMLElement[]) {
        this.node.append(...childNodes);
    }

    public prepend(...childNodes: HTMLElement[]) {
        this.node.prepend(...childNodes);
    }
}

export default Element;
