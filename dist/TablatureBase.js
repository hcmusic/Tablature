import { utils } from "./utils";
import { TabNote } from "./Note";
import { Flow } from "vexflow";
export class TabBase {
    constructor() {
        this.dritySection = new Set([]);
        this.shouldDrawAll = true;
    }
    //todo: do a stricter check for these function
    setData(data) {
        this.clearData();
        let na = [];
        for (let i = 0; i < data.length; i++) {
            let newSection = [];
            for (let j = 0; j < data[i].length; j++) {
                let newNote = new TabNote({ noteValue: data[i][j][0], stringContent: data[i][j][1], userData: data[i][j][2] });
                newSection.push(newNote);
            }
            na.push(newSection);
        }
        this.notes = na;
        this.shouldDrawAll = true;
    }
    getNoteData(section, note) {
        return this.notes[section][note];
    }
    setNoteData(section, note, data) {
        this.notes[section][note] = data;
        this.dritySection.add(section);
    }
    setStringDataOfNote(section, note, string, data) {
        if (string >= 0 && string <= 5) {
            this.notes[section][note][1][string] = data;
        }
        this.dritySection.add(section);
    }
    getSectionData(section) {
        return this.notes[section];
    }
    deleteNote(section, note, number = 1) {
        let dn = this.notes[section].splice(note, number);
        if (dn.length > 0)
            this.dritySection.add(section);
        return dn;
    }
    addNote(section, note, data) {
        if (section === -1 || section >= this.notes.length) {
            section = this.notes.length;
            this.notes.push([]);
        }
        if (note === -1 || note > this.notes[section].length) {
            note = this.notes[section].length;
        }
        this.notes[section].splice(note, 0, data);
        this.dritySection.add(section);
        return [section, note];
    }
    isBlankNote(section, note) {
        for (let i = 0; i < 6; i++) {
            if (this.notes[section][note][1][i] != -1) {
                return false;
            }
        }
        return true;
    }
    getNoteNumberOfSection(section) {
        if (!this.notes[section])
            return -1;
        return this.notes[section].length;
    }
    getSectionNumber() {
        return this.notes.length;
    }
    insertSection(section, data = []) {
        if (section < 0 || section > this.notes.length) {
            return false;
        }
        this.notes.splice(section, 0, data);
        for (let i = section; i < this.notes.length; i++) {
            this.dritySection.add(section + i);
        }
        return true;
    }
    getNoteFlattenNumber(section, note) {
        if (!this.notes[section])
            return -1;
        // if(note === -1) note = this.notes[section].length - 1;
        if (this.notes[section][note]) {
            let total = 0;
            for (let i = 0; i < section; i++)
                total += this.notes[i].length;
            total += note;
            return total;
        }
        return -1;
    }
    clearData() {
        this.notes = [[]];
        this.shouldDrawAll = true;
    }
}
export class TabView extends TabBase {
    constructor() {
        super();
        this.calTabData = { sections: [] };
        this.containerHeight = 700;
        this.lineWidth = 1000;
        this.sectionPerLine = 4;
        this.tabStringPadding = 13; // distance between each string, just a reference number here, it is set in vexflow
        this.linePerPage = 20;
        this.lineMargin = 42; // only for left and right
        this.linePadding = [32, 14];
        this.lineDistance = 90; // distance between each line
        this.startPosition = [this.lineMargin + this.linePadding[0] + 20, 120 + this.linePadding[1]]; // x, y
        this.lineStartPosition = [this.lineMargin, 120]; // total line number, last line X, last line Y
        this.domElement = document.createElement("div");
        this.renderer = new Flow.Renderer(this.domElement, 3 /* SVG */);
        this.context = this.renderer.getContext();
    }
    getSectionLeftTopPos(section) {
        if (section < this.notes.length) {
            return [this.calTabData.sections[section].x, this.calTabData.sections[section].y];
        }
        return [-1, -1];
    }
    getSectionWidth(section) {
        if (section < this.notes.length) {
            return this.calTabData.sections[section].width;
        }
        return 0;
    }
    getSectionHeight(section) {
        if (section < this.notes.length) {
            return this.calTabData.sections[section].height;
        }
        return 0;
    }
    attach(anchor) {
        anchor.append(this.domElement);
        utils.setStyle(anchor, { width: `${this.width + 20}px` }); // add 20 for scroll bar
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
    getNotePosition(section, note, string = 0) {
        let sum = 0;
        if (!this.calTabData.sections[section] || !this.calTabData.sections[section].notes[note])
            return [-1, -1];
        let sel = this.calTabData.sections[section].notes[note].string[string];
        return [sel.x, sel.y];
    }
    clearData() {
        super.clearData();
        //this.tabCanvas.layers.notes.removeNote(0, this.tabCanvas.layers.notes.noteElements.length);
    }
}
export class TabInterative extends TabView {
    constructor() {
        super(...arguments);
        this.inEdit = true;
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
    scrollTo(val) {
        this.domElement.scrollTop = val;
    }
    adjustPostion(y) {
        if (y + 220 > this.domElement.scrollTop + this.containerHeight) {
            this.scrollTo(y - this.containerHeight + 220);
        }
        if (y - 80 < this.domElement.scrollTop) {
            this.scrollTo(y - 80);
        }
    }
}
//# sourceMappingURL=TablatureBase.js.map