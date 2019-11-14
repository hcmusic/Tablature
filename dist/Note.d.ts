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
    noteValue: number;
    stringContent: number[];
    userData: any;
    makeFlowTabNote(extendWidth?: number): Flow.TabNote;
}
