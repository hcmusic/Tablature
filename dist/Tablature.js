import { Flow } from "vexflow";
import { TabInterative } from "./TablatureBase";
import { utils, Callbacks } from "./utils";
export class Tablature extends TabInterative {
    constructor(data) {
        super();
        this.lengthPerBeat = 4;
        this.beatPerSection = 4;
        this.basicNoteNumber = 8; // mini note number for every section to calculate width;
        Object.assign(this, data);
        this.width = this.lineWidth + this.linePadding[0] * 2 + 42 * 2;
        // additional 20 pixel for scrollbar
        utils.setStyle(this.domElement, { "width": `${this.width + 20}px`,
            height: `${this.containerHeight}px`,
            "overflow-y": "auto",
            "overflow-x": "hidden",
            outline: "none",
            "user-select": "none",
        });
        utils.setAttributes(this.domElement, { tabindex: "-1" });
        this.callbacks = new Callbacks([
            "noteclick",
            "noteshiftclick",
            "notealtclick",
            "notectrlclick",
            "keydown",
            "mouseovernote",
            "mouseoutnote",
            "mousedown",
            "mousemove",
            "mouseup",
            "rightclick",
            "sectionhover",
            "sectionhout",
            "sectionclick",
        ]);
        this.renderer.resize(this.width, 600);
        this.context.setFont("Arial", 10, 12).setBackgroundFillStyle("rgba(255, 0, 0, 0.0)");
        this.context.createLayer("/sheet");
        this.context.createLayer("/note");
    }
    render() {
        if (this.shouldDrawAll) {
            for (let i = 0; i <= this.getLineNumberOfSection(this.notes.length - 1); i++) { //line
                this.drawSectionsOfLine(i);
            }
            this.shouldDrawAll = false;
        }
        else {
            let lines = new Set();
            for (let v of this.dritySection.values()) {
                lines.add(this.getLineNumberOfSection(v));
            }
            for (let l of lines.values()) {
                this.drawSectionsOfLine(l);
            }
            this.dritySection.clear();
        }
    }
    on(ename, cbk) {
        if (ename in this.callbacks) {
            this.callbacks[ename].push(cbk);
        }
    }
    drawSectionsOfLine(line) {
        let [x, y] = this.lineStartPosition;
        y += this.lineDistance * line;
        let totalNote = 2; // 2 for clef
        let sections = this.getSectionsNumberOfLine(line);
        for (let j = 0; j < sections.length; j++) { // count total note of line
            if (this.notes[sections[j]]) {
                let addnote = Math.max(this.basicNoteNumber, this.notes[line * this.sectionPerLine + j].length);
                totalNote += addnote;
            }
            else {
                totalNote += this.basicNoteNumber;
            }
        }
        for (let j = 0; j < sections.length; j++) { // count section position and width
            let sect = sections[j];
            if (!this.notes[sect])
                break;
            let noteNumber = Math.max(this.basicNoteNumber, this.notes[sect].length);
            if (j == 0)
                noteNumber += 2;
            let width = this.lineWidth * (noteNumber) / totalNote;
            let stave = this.drawSection(sect, x, y, width, j === 0);
            this.drawNotesOfSection(stave, sect, width);
            x += width;
        }
    }
    drawSection(section, x, y, width, drawClef = false) {
        if (!this.notes[section])
            return;
        //store section geometry data
        this.calTabData.sections[section] = {
            notes: [],
            x: x,
            y: y,
            width: width,
            height: this.tabStringPadding * 5,
        };
        let stave = new Flow.TabStave(x, y, width);
        if (drawClef)
            stave.addClef("tab").addTimeSignature(`${this.beatPerSection}/${this.lengthPerBeat}`);
        this.context.createLayer(`/sheet/${section}`);
        let layer = this.context.useLayer(`/sheet/${section}`);
        layer.clear();
        stave.setContext(this.context).draw();
        return stave;
    }
    drawNotesOfSection(stave, section, sectionWidth = 0) {
        let flowNotes = [];
        let totalNoteLength = 0;
        for (let note of this.notes[section]) {
            totalNoteLength += 1 / note.noteValue;
        }
        for (let note of this.notes[section]) {
            let ew = (1 / note.noteValue) / totalNoteLength * (sectionWidth - 150);
            flowNotes.push(note.makeFlowTabNote(ew));
        }
        this.context.createLayer(`/note/${section}`);
        let layer = this.context.useLayer(`/note/${section}`);
        layer.clear();
        Flow.Formatter.FormatAndDraw(this.context, stave, flowNotes);
        let rects = Array.from(layer.svg.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect"));
        //store note geometry data and add evnet callback
        let k = 0;
        for (let i = 0; i < layer.svg.children.length; i++) {
            let element = layer.svg.children[i];
            if (element.tagName === "text") {
                utils.setStyle(element, { "pointer-events": "none" });
            }
            else if (element.tagName === "rect") {
                const ni = Math.floor(k / 6);
                // data on element is top-left position and we want center position
                const x = Number(element.getAttribute("x")) + Number(element.dataset.textWidth) / 2 + 2;
                const y = Number(element.getAttribute("y")) + 4;
                if (!this.calTabData.sections[section].notes[ni])
                    this.calTabData.sections[section].notes[ni] = { string: [] };
                this.calTabData.sections[section].notes[ni].string.push({
                    fret: this.notes[section][ni].stringContent[k % 6],
                    x: x,
                    y: y,
                    width: Number(element.dataset.textWidth)
                });
                element.addEventListener("click", ev => {
                    this.callbacks["noteclick"].callAll(section, ni, k % 6, [x, y], ev.currentTarget);
                });
                k++;
            }
        }
    }
    // line index start from 0
    getLineNumberOfSection(section) {
        return Math.floor(section / this.sectionPerLine);
    }
    getSectionsNumberOfLine(line) {
        let sections = [];
        for (let i = 0; i < this.sectionPerLine; i++) {
            if (this.notes[line * this.sectionPerLine + i]) {
                sections.push(line * this.sectionPerLine + i);
            }
            else {
                break;
            }
        }
        return sections;
    }
}
//# sourceMappingURL=Tablature.js.map