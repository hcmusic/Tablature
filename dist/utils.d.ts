export declare namespace utils {
    function setAttributes(el: Element, attr: {
        [key: string]: string;
    }): void;
    function setStyle(el: HTMLElement | SVGElement, style: {
        [key: string]: string;
    }): void;
    function noteToDecimal(note: string): number;
}
declare class ArrayFunction {
    private funcs;
    callAll(...args: any[]): void;
    push(cbk: (...args: any[]) => void): void;
}
export declare class Callbacks {
    [key: string]: ArrayFunction;
    constructor(eventType: Array<string>);
}
export {};
