import { utils } from "./utils"
import { TabSection, TabNote } from "./Note"
import { Flow } from "vexflow"

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

export class TabBase{
    notes: TabSection[];
    protected dritySection: Set<number> = new Set([]);
    protected shouldDrawAll = true;
    //todo: do a stricter check for these function
    setData(data: [number, number[], any][][]) {
        this.clearData();
        let na: TabNote[][] = [];
        for(let i = 0; i < data.length; i++){
            let newSection: TabNote[] = [];
            for(let j = 0; j < data[i].length; j++){
                let newNote = new TabNote({noteValue: data[i][j][0], stringContent: data[i][j][1], userData: data[i][j][2]});
                newSection.push(newNote);
            }
            na.push(newSection);
        }
        this.notes = na;
        this.shouldDrawAll = true;
    }

    getNoteData(section: number, note: number): TabNote{
        return this.notes[section][note];
    }
    
    setNoteData(section: number, note: number, data: TabNote){
        this.notes[section][note] = data;
        this.dritySection.add(section);
    }

    setStringDataOfNote(section: number, note: number, string: number, data: number){
        if(string >=0 && string <= 5){
            this.notes[section][note][1][string] = data;
        }
        this.dritySection.add(section);
    }

    getSectionData(section: number): TabNote[]{
        return this.notes[section];
    }

    deleteNote(section: number, note: number, number: number = 1): TabNote[]{
        let dn = this.notes[section].splice(note, number);
        if(dn.length > 0)this.dritySection.add(section);
        return dn;
    }

    addNote(section: number, note: number, data: TabNote): [number, number]{
        if(section === -1 || section >= this.notes.length){
            section = this.notes.length;
            this.notes.push([]);
        }
        if(note === -1 || note > this.notes[section].length){
            note = this.notes[section].length;
        }
        this.notes[section].splice(note, 0, data);
        this.dritySection.add(section);
        return [section, note];
    }

    isBlankNote(section: number, note: number){
        for(let i = 0; i < 6; i++){
            if(this.notes[section][note][1][i] != -1){
                return false;
            }
        }
        return true;
    }

    getNoteNumberOfSection(section: number){
        if(!this.notes[section])return -1;
        return this.notes[section].length;
    }

    getSectionNumber(){
        return this.notes.length;
    }

    insertSection(section: number, data: TabSection = []): boolean{
        if(section < 0 || section > this.notes.length){
            return false;
        }
        this.notes.splice(section, 0, data);
        for(let i = section; i < this.notes.length; i++){
            this.dritySection.add(section + i);
        }
        return true;
    }

    getNoteFlattenNumber(section: number, note: number): number{
        if(!this.notes[section]) return -1;
        // if(note === -1) note = this.notes[section].length - 1;
        if(this.notes[section][note]){
            let total = 0;
            for(let i = 0; i < section; i++) total += this.notes[i].length;
            total += note;
            return total;
        }
        return -1;
    }

    clearData(){
        this.notes = [[]];
        this.shouldDrawAll = true;
    }

}

export class TabView extends TabBase{
    renderer: Flow.Renderer;
    context: Flow.SVGContext;
    calTabData: CalTab = { sections: []};
    domElement: HTMLElement;
    readonly containerHeight: number = 700;
    protected lineWidth: number = 1000;
    protected sectionPerLine: number = 4;
    protected tabStringPadding: number = 13; // distance between each string, just a reference number here, it is set in vexflow
    protected linePerPage: number = 20;
    protected lineMargin: number = 42; // only for left and right
    protected linePadding: [number, number] = [32, 14];
    protected lineDistance: number = 90; // distance between each line
    protected startPosition: number[] = [this.lineMargin + this.linePadding[0] + 20, 120 + this.linePadding[1]]; // x, y
    protected lineStartPosition: [number, number] = [this.lineMargin, 120]; // total line number, last line X, last line Y
    protected height: number;
    protected width: number;

    constructor(){
        super();
        this.domElement = document.createElement("div");
        this.renderer = new Flow.Renderer(this.domElement,  Flow.Renderer.Backends.SVG);
        this.context = <Flow.SVGContext>this.renderer.getContext();
    }

    

    getSectionLeftTopPos(section: number): [number, number]{
        if(section < this.notes.length){
            return [this.calTabData.sections[section].x, this.calTabData.sections[section].y];
        }
        return [-1, -1]
    }

    getSectionWidth(section: number): number{
        if(section < this.notes.length){
            return this.calTabData.sections[section].width;
        }
        return 0;
    }

    getSectionHeight(section: number): number{
        if(section < this.notes.length){
            return this.calTabData.sections[section].height;
        }
        return 0;
    }

    attach(anchor: HTMLElement){
        anchor.append(this.domElement);
        utils.setStyle(anchor, {width: `${this.width + 20}px`});// add 20 for scroll bar
    }

    // noteIndex(note: SVGNote){
    //     return this.tabCanvas.layers.notes.noteElements.indexOf(note);
    // }

    // getSVGNote(section: number, note: number): SVGNote{
    //     let noteElements = this.tabCanvas.layers.notes.noteElements;
    //     return noteElements.find((elem) => {
    //         return elem.section == section && elem.note == note
    //     })
    // }

    getNotePosition(section: number, note: number, string: number = 0): [number, number]{
        let sum = 0;
        if(!this.calTabData.sections[section] || !this.calTabData.sections[section].notes[note])
            return [-1, -1];

        let sel = this.calTabData.sections[section].notes[note].string[string];
        return [sel.x, sel.y];
    }

    clearData(){
        super.clearData();
        //this.tabCanvas.layers.notes.removeNote(0, this.tabCanvas.layers.notes.noteElements.length);
    }

}

export class TabInterative extends TabView{
    inEdit: boolean = true;
    scrollTo(val: number){
        this.domElement.scrollTop = val;
    }

    adjustPostion(y: number){
        if(y + 220 > this.domElement.scrollTop + this.containerHeight){
            this.scrollTo(y - this.containerHeight + 220);
        }
        if(y - 80 < this.domElement.scrollTop){
            this.scrollTo(y - 80);
        }
    }
        /**
     * Drag and drog area select notes
     * Bad implement by now, the function search each note to find collision
     * Algorithm will be fixed in future.
     */
    // areaSelect(x1: number, y1: number, x2: number, y2: number){
    //     let noteElements = this.tabCanvas.layers.notes.noteElements;
    //     var selectedNoteIds: number[] = [];
    //     let leftSelectedNote: number;
    //     let rightSelectedNote: number;
    //     for(let i = 0; i < noteElements.length; i++){
    //         for(let j = 0; j < 6; j++){
    //             //Check if note is in the selected area
    //             if(noteElements[i].blockGroup[j].x >= x1 
    //                 && noteElements[i].blockGroup[j].x <= x2 
    //                 && noteElements[i].blockGroup[j].y >=y1 
    //                 && noteElements[i].blockGroup[j].y <=y2 
    //                 && noteElements[i].domElement.style.display != "none"){
    //                 selectedNoteIds.push(i);
    //             }
    //         }
    //     }
    //     leftSelectedNote = Math.min(...selectedNoteIds);
    //     rightSelectedNote = Math.max(...selectedNoteIds);
    //     return noteElements.slice(leftSelectedNote, rightSelectedNote+1);
    // }

    // endsSelect(head: number, tail: number): SVGNote[]{
    //     if(head > tail){
    //         let temp = tail;
    //         tail = head;
    //         head = temp;
    //     }
    //     return this.tabCanvas.layers.notes.noteElements.slice(head, tail+1);
    // }

    // headToEndSelect(head: number): SVGNote[]{
    //     return this.tabCanvas.layers.notes.noteElements.slice(head, this.tabCanvas.layers.notes.noteElements.length);
    // }
    
    // addNote(section: number, note: number, data: Note): [number, number]{
    //     if(this.inEdit){
    //         return super.addNote(section, note, data);
    //     }
    //     return [-1, -1];
    // }
}