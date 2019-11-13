import { Flow } from "vexflow";
import { TabSection, TabNote } from "./Note"
import { TabInterative } from "./TablatureBase"
import { utils } from "./utils"
export class Tablature extends TabInterative{
    readonly lengthPerBeat: number = 4;
    readonly beatPerSection: number = 4;
    private basicNoteNumber = 8; // mini note number for every section to calculate width;
    constructor(data?: {lengthPerBeat?: number, beatPerSection?: number, lineWidth?: number, sectionPerLine?: number, linePerPage?: number}){
        super();
        Object.assign(this, data);
        this.width = this.lineWidth + this.linePadding[0]*2 + 42*2;
        // additional 20 pixel for scrollbar
        utils.setStyle(this.domElement, {"width": `${this.width + 20}px`,
            height: `${this.containerHeight}px`,
            "overflow-y": "auto",
            "overflow-x": "hidden",
            outline: "none",
            "user-select": "none",
        });
        utils.setAttributes(this.domElement, {tabindex: "-1"});

        this.renderer.resize(this.width, 600);
        this.context.setFont("Arial", 10, 12).setBackgroundFillStyle("rgba(255, 255, 255,0.0)");
        this.context.createLayer("/sheet");
        this.context.createLayer("/note");
    }

    render(){
        if(this.shouldDrawAll){
            for(let i = 0; i <= this.getLineNumberOfSection(this.notes.length - 1); i++){//line
                this.drawSectionsOfLine(i);
            }
            this.shouldDrawAll = false;
        }else{
            let lines = new Set<number>();
            for(let v of this.dritySection.values()){
                lines.add(this.getLineNumberOfSection(v));
            }
            for(let l of lines.values()){
                this.drawSectionsOfLine(l);
            }
            this.dritySection.clear();
        }
    }

    private drawSectionsOfLine(line: number){
        let [x, y] = this.lineStartPosition;
        y += this.lineDistance * line;
        let totalNote = 2; // 2 for clef
        let sections = this.getSectionsNumberOfLine(line);
        for(let j = 0; j < sections.length; j++){ // count total note of line
            if(this.notes[sections[j]]){
                let addnote = Math.max(this.basicNoteNumber, this.notes[line*this.sectionPerLine + j].length);
                totalNote += addnote;
            }else{
                totalNote += this.basicNoteNumber;
            }
        }
        for(let j = 0; j < sections.length; j++){ // count section position and width
            let sect = sections[j];
            if(!this.notes[sect]) break;
            let noteNumber = Math.max(this.basicNoteNumber, this.notes[sect].length);
            if(j == 0) noteNumber += 2;
            let width = this.lineWidth * (noteNumber) / totalNote;
            let stave = this.drawSection(sect, x, y, width, j === 0);
            this.drawNotesOfSection(stave, sect);
            x += width;
        }
    }

    private drawSection(section: number, x: number, y: number, width: number, drawClef: boolean = false): Flow.TabStave{
        if(!this.notes[section]) return;
        //store section geometry data
        this.calTabData.sections[section] = {
            notes: [],
            x: x,
            y: y,
            width: width,
            height: this.tabStringPadding * 5,
        }
        let stave = new Flow.TabStave(x, y, width);
        if(drawClef) stave.addClef("tab").addTimeSignature(`${this.beatPerSection}/${this.lengthPerBeat}`);
        this.context.createLayer(`/sheet/${section}`);
        let layer = this.context.useLayer(`/sheet/${section}`);
        layer.clear();
        stave.setContext(this.context).draw();
        return stave;
    }

    private drawNotesOfSection(stave: Flow.TabStave, section: number){
        let flowNotes: Flow.TabNote[] = [];
        for(let note of this.notes[section]){
            flowNotes.push(note.makeFlowTabNote());
        }
        this.context.createLayer(`/note/${section}`);
        let layer = this.context.useLayer(`/note/${section}`);
        layer.clear();
        Flow.Formatter.FormatAndDraw(this.context, stave, flowNotes);
        let rects = Array.from(layer.svg.getElementsByTagNameNS("http://www.w3.org/2000/svg", "rect"));
        //store note geometry data
        for(let k = 0; k < rects.length; k++){
            let ni = Math.floor(k/6);
            if(!this.calTabData.sections[section].notes[ni])
                this.calTabData.sections[section].notes[ni] = {string: []}
            this.calTabData.sections[section].notes[ni].string.push({
                fret: this.notes[section][ni].stringContent[k%6],
                x: Number(rects[k].getAttribute("x")), 
                y: Number(rects[k].getAttribute("x")), 
                width: Number(rects[k].dataset.textWidth)
            });
        }
    }

    // line index start from 0
    private getLineNumberOfSection(section: number){
        return Math.floor(section / this.sectionPerLine);
    }

    private getSectionsNumberOfLine(line: number){
        let sections = [];
        for(let i = 0; i < this.sectionPerLine; i++) {
            if(this.notes[line * this.sectionPerLine + i]){
                sections.push(line * this.sectionPerLine + i);
            }else{
                break;
            }
        }
        return sections;
    }
}