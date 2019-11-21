import { Flow } from "vexflow";
import { TabInterative, Position, StringGeometry } from "./TablatureBase"
import { utils, Callbacks } from "./utils"

interface eventCallBackInterface {
    tabnoteclick: (section: number , note: number , string: number, position: number[], currentTarget: SVGElement) => any;
    stavenoteclick: (section: number, note: number, key: string, position: number[], currentTarget: SVGElement) => any;
}

export class Tablature extends TabInterative{
    readonly lengthPerBeat: number = 4;
    readonly beatPerSection: number = 4;
    private callbacks: Callbacks;
    private basicNoteNumber = 8; // mini note number for every section to calculate width;
    private drawTab = true;
    private drawStave = true;
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
        this.callbacks = new Callbacks([
            "tabnoteclick",
            "stavenoteclick"
        ]);

        this.renderer.resize(this.width, 600);
        this.context.setFont("Arial", 10, 12).setBackgroundFillStyle("rgba(255, 0, 0, 0.0)");
        this.context.createLayer("/sheet");
        this.context.createLayer("/note");
    }

    render(){
        if(this.shouldDrawAll){
            for(let i = 0; i <= this.getLineNumberOfSection(this.tabNotes.length - 1); i++){//line
                this.drawSectionsOfLine(i);
            }
            this.shouldDrawAll = false;
        }else{
            let lines = new Set<number>();
            for(let v of this.dirtySection.values()){
                lines.add(this.getLineNumberOfSection(v));
            }
            for(let l of lines.values()){
                this.drawSectionsOfLine(l);
            }
            this.dirtySection.clear();
        }
    }

    on<k extends keyof eventCallBackInterface>(ename: k, cbk: eventCallBackInterface[k]) {
        if(ename in this.callbacks) {
            this.callbacks[ename].push(cbk);
        }
    }

    private drawSectionsOfLine(line: number){
        let [x, y] = this.lineStartPosition;
        y += this.lineDistance * line;
        let totalNote = 2; // 2 for clef
        let sections = this.getSectionsNumberOfLine(line);
        for(let j = 0; j < sections.length; j++){ // count total note of line
            if(this.tabNotes[sections[j]]){
                let addnote = Math.max(this.basicNoteNumber, this.tabNotes[line*this.sectionPerLine + j].length);
                totalNote += addnote;
            }else{
                totalNote += this.basicNoteNumber;
            }
        }
        for(let j = 0; j < sections.length; j++){ // count section position and width
            let sect = sections[j];
            if(!this.tabNotes[sect]) break;
            let noteNumber = Math.max(this.basicNoteNumber, this.tabNotes[sect].length);
            if(j == 0) noteNumber += 2;
            let width = this.lineWidth * (noteNumber) / totalNote;
            let [stave, tab] = this.drawSection(sect, x, y, width, j === 0);
            this.drawNotesOfSection(stave, tab, sect, width);
            x += width;
        }
    }

    private drawSection(section: number, x: number, y: number, width: number, drawClef: boolean = false): [Flow.Stave, Flow.TabStave] {
        if(!this.tabNotes[section]) return;
        //store section geometry data
        let stave:Flow.Stave = null, tab: Flow.TabStave = null;
        if(this.drawStave){
            stave = this.drawStaveSection(section, x, y, width, drawClef);
            if(this.drawTab){
                tab = this.drawTabSection(section, x, y + 80, width, drawClef);
            }
        }else if(this.drawTab){
            tab = this.drawTabSection(section, x, y, width, drawClef)
        }
        return [stave, tab];
    }

    private drawTabSection(section: number, x: number, y: number, width: number, drawClef: boolean = false): Flow.TabStave{
        if(!this.drawTab) return null;
        if(!this.tabNotes[section]) return null;
        //store section geometry data
        this.calTabData.sections[section] = {
            tabNotes: [],
            x: x,
            y: y,
            width: width,
            height: this.tabStringPadding * 5,
        }
        let tab = new Flow.TabStave(x, y, width);
        let stave = new Flow.Stave(x, y , width);
        if(drawClef){
            tab.addClef("tab").addTimeSignature(`${this.beatPerSection}/${this.lengthPerBeat}`);
            this.context.useLayer("/sheet/number");
            if(!this.drawStave){
                this.context.fillText(`section ${section + 1}`, x, y + 45, {"font-size": "8pt"});
            }
        }
        let layer = this.context.useLayer(`/sheet/tab/section-${section}`);
        layer.clear();
        tab.setContext(this.context).draw();
        return tab;
    }
    
    private drawStaveSection(section: number, x: number, y: number, width: number, drawClef: boolean = false): Flow.Stave{
        if(!this.drawStave) return null;
        if(!this.tabNotes[section]) return null;
        this.calStaveData.sections[section] = {
            staveNotes: [],
            x: x,
            y: y,
            width: width,
            height: this.staveStringPadding * 5,
        }
        let stave = new Flow.Stave(x, y , width);
        if(drawClef){
            stave.addClef("treble").addTimeSignature(`${this.beatPerSection}/${this.lengthPerBeat}`);
            this.context.useLayer("/sheet/number")
            this.context.fillText(`section ${section + 1}`, x, y + 15, {"font-size": "8pt"});
        }
        let layer = this.context.useLayer(`/sheet/stave/section-${section}`);
        layer.clear();
        stave.setContext(this.context).draw();
        return stave;
    }

    private drawNotesOfSection(stave: Flow.Stave, tab: Flow.TabStave, section: number, sectionWidth: number = 0){
        if(stave) this.drawStaveNoteOfSection(stave, section, sectionWidth);
        if(tab) this.drawTabNoteOfSection(tab, section, sectionWidth);
    }

    private drawTabNoteOfSection(tab: Flow.TabStave, section: number, sectionWidth: number = 0){
        let flowNotes: Flow.TabNote[] = [];
        let totalNoteLength = 0;
        for(let note of this.tabNotes[section]){
            totalNoteLength += 1 / note.noteValue;
        }
        for(let note of this.tabNotes[section]){
            let ew = (1 / note.noteValue) / totalNoteLength * (sectionWidth - 150);
            flowNotes.push(note.makeFlowTabNote(ew, !this.drawStave));
        }
        let layer = this.context.useLayer(`/note/tab/${section}`);
        layer.clear();
        Flow.Formatter.FormatAndDraw(this.context, tab, flowNotes);
        //store note geometry data and add evnet callback
        let k = -1;
        for(let i = 0; i < layer.svg.children.length; i++){
            let element = layer.svg.children[i] as SVGElement;
            if(element.tagName === "text"){
                utils.setStyle(element, {"pointer-events": "none"});
            }else if(element.tagName === "rect"){
                k++;
                const ni = Math.floor(k/6);
                // data on element is top-left position and we want center position
                const x = Number(element.getAttribute("x")) + Number(element.dataset.textWidth) / 2 + 2;
                const y = Number(element.getAttribute("y")) + 6;
                if(!this.calTabData.sections[section].tabNotes[ni])
                    this.calTabData.sections[section].tabNotes[ni] = {strings: new Map<number, StringGeometry>()};
                
                if(this.tabNotes[section][ni].modifier && this.tabNotes[section][ni].modifier.rest){
                    if(k%6 === 2){
                        this.calTabData.sections[section].tabNotes[ni].strings.set(2, {
                            fret: -2,
                            x: x, 
                            y: y, 
                            width: Number(element.dataset.textWidth)
                        });
                    }else{
                        continue;
                    }
                }else{
                    if(this.tabNotes[section][ni].stringContent[k%6] !== -1){
                        this.calTabData.sections[section].tabNotes[ni].strings.set(k%6, {
                            fret: this.tabNotes[section][ni].stringContent[k%6],
                            x: x, 
                            y: y, 
                            width: Number(element.dataset.textWidth)
                        });
                    }
                }
                element.addEventListener("click", ev => {
                    this.callbacks["tabnoteclick"].callAll(section, ni, k%6, [x, y], ev.currentTarget);
                })
            }
        }
    }

    private drawStaveNoteOfSection(stave: Flow.Stave, section: number, sectionWidth: number = 0){
        let flowNotes: Flow.StaveNote[] = [];
        let totalNoteLength = 0;
        for(let note of this.tabNotes[section]){
            totalNoteLength += 1 / note.noteValue;
        }
        for(let note of this.staveNotes[section]){
            let ew = (1 / note.noteValue) / totalNoteLength * (sectionWidth - 150);
            flowNotes.push(note.makeFlowStaveNote());
        }
        let layer = this.context.useLayer(`/note/stave/${section}`);
        layer.clear();
        Flow.Formatter.FormatAndDraw(this.context, stave, flowNotes);
        //set click event and store geometry data
        for(let i = 0; i < this.staveNotes[section].length; i++){
            for(let drawnNoteHead of this.staveNotes[section][i].staveNote.drawnNoteHead){
                let key = drawnNoteHead.dataset.key;
                let x = Number(drawnNoteHead.dataset.x);
                let y = Number(drawnNoteHead.dataset.y);
                if(!this.calStaveData.sections[section].staveNotes[i])
                    this.calStaveData.sections[section].staveNotes[i] = {keys: new Map<string, Position>()};
                this.calStaveData.sections[section].staveNotes[i].keys.set(key, {x: x, y: y});
                drawnNoteHead.addEventListener("click", ev => {
                    this.callbacks["stavenoteclick"].callAll(section, i, key, [x, y], drawnNoteHead);
                })
            }
        }
    }

    // line index start from 0
    private getLineNumberOfSection(section: number){
        return Math.floor(section / this.sectionPerLine);
    }

    private getSectionsNumberOfLine(line: number){
        let sections = [];
        for(let i = 0; i < this.sectionPerLine; i++) {
            if(this.tabNotes[line * this.sectionPerLine + i]){
                sections.push(line * this.sectionPerLine + i);
            }else{
                break;
            }
        }
        return sections;
    }
}