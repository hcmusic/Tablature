import { Flow } from "vexflow";
export declare type TabSection = TabNote[];
export declare class TabNote {
    0: number;
    1: number[];
    2: any;
    tabNote: Flow.TabNote;
    constructor(data?: {
        noteValue?: number;
        stringContent?: number[];
        userData?: any;
        0?: number;
        1?: number[];
        2?: any;
    });
    get noteValue(): number;
    set noteValue(l: number);
    get stringContent(): number[];
    set stringContent(v: number[]);
    get userData(): any;
    set userData(v: any);
    makeFlowTabNote(extendWidth?: number, drawStem?: boolean): Flow.TabNote;
}
