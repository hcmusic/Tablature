import { TabInterative } from "./TablatureBase";
interface eventCallBackInterface {
    noteclick: (section: number, note: number, string: number, position: number[], currentTarget: SVGElement) => any;
    keydown: (key: string, keyCode: number) => any;
    mouseovernote: (section: number, note: number, string: number, position: number[], currentTarget: HTMLElement) => any;
    mouseoutnote: (section: number, note: number, string: number, position: number[], currentTarget: HTMLElement) => any;
    noteshiftclick: (section: number, note: number, string: number, position: number[], currentTarget: HTMLElement) => any;
    notealtclick: (section: number, note: number, string: number, position: number[], currentTarget: HTMLElement) => any;
    notectrlclcik: (section: number, note: number, string: number, position: number[], currentTarget: HTMLElement) => any;
    mousedown: (x: number, y: number) => any;
    mousemove: (x: number, y: number) => any;
    mouseup: (x: number, y: number) => any;
    sectionhover: (section: number) => any;
    sectionhout: (section: number) => any;
    sectionclick: (section: number, string: number) => any;
}
export declare class Tablature extends TabInterative {
    readonly lengthPerBeat: number;
    readonly beatPerSection: number;
    private callbacks;
    private basicNoteNumber;
    constructor(data?: {
        lengthPerBeat?: number;
        beatPerSection?: number;
        lineWidth?: number;
        sectionPerLine?: number;
        linePerPage?: number;
    });
    render(): void;
    on<k extends keyof eventCallBackInterface>(ename: k, cbk: eventCallBackInterface[k]): void;
    private drawSectionsOfLine;
    private drawSection;
    private drawNotesOfSection;
    private getLineNumberOfSection;
    private getSectionsNumberOfLine;
}
export {};
