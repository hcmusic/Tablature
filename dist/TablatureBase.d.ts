import { TabSection, TabNote } from "./Note";
import { Flow } from "vexflow";
interface CalTab {
    sections: {
        notes: {
            string: {
                fret: number;
                x: number;
                y: number;
                width: number;
            }[];
        }[];
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
}
export declare class TabBase {
    notes: TabSection[];
    protected dritySection: Set<number>;
    protected shouldDrawAll: boolean;
    setData(data: [number, number[], any][][]): void;
    getNoteData(section: number, note: number): TabNote;
    setNoteData(section: number, note: number, data: TabNote): void;
    setStringDataOfNote(section: number, note: number, string: number, data: number): void;
    getSectionData(section: number): TabNote[];
    deleteNote(section: number, note: number, number?: number): TabNote[];
    addNote(section: number, note: number, data: TabNote): [number, number];
    isBlankNote(section: number, note: number): boolean;
    getNoteNumberOfSection(section: number): number;
    getSectionNumber(): number;
    insertSection(section: number, data?: TabSection): boolean;
    getNoteFlattenNumber(section: number, note: number): number;
    clearData(): void;
}
export declare class TabView extends TabBase {
    renderer: Flow.Renderer;
    context: Flow.SVGContext;
    calTabData: CalTab;
    domElement: HTMLElement;
    readonly containerHeight: number;
    protected lineWidth: number;
    protected sectionPerLine: number;
    protected tabStringPadding: number;
    protected linePerPage: number;
    protected lineMargin: number;
    protected linePadding: [number, number];
    protected lineDistance: number;
    protected startPosition: number[];
    protected lineStartPosition: [number, number];
    protected height: number;
    protected width: number;
    constructor();
    getSectionLeftTopPos(section: number): [number, number];
    getSectionWidth(section: number): number;
    getSectionHeight(section: number): number;
    attach(anchor: HTMLElement): void;
    getNotePosition(section: number, note: number, string?: number): [number, number];
    clearData(): void;
}
export declare class TabInterative extends TabView {
    inEdit: boolean;
    scrollTo(val: number): void;
    adjustPostion(y: number): void;
}
export {};
