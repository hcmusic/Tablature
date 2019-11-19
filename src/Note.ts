import { Flow } from "vexflow"
export type TabSection = TabNote[];
export type StaveSection = StaveNote[];
export class TabNote {
    0: number; //duration
    1: number[]; // fret
    2: any; //modifier
    tabNote: Flow.TabNote;
    constructor(data: {noteValue?: number, stringContent?: number[], modifier?: any, 0?: number, 1?: number[], 2?: any} = {}){
        if(data[0]){
            this[0] = data[0];
            this[1] = data[1] || [-1, -1, -1, -1, -1, -1];
            this[2] = data[2] || null;
            return;
        }
        this[0] = data.noteValue || 4;
        this[1] = data.stringContent || [-1, -1, -1, -1, -1, -1];
        this[2] = data.modifier || null;
    }
    get noteValue(): number{
        return this[0];
    }
    set noteValue(l: number){
        this[0] = l;
    }
    get stringContent(){
        return this[1];
    }
    set stringContent(v: number[]){
        this[1] = v;
    }
    get modifier(){
        return this[2];
    }
    set modifier(v: any){
        this[2] = v;
    }

    makeFlowTabNote(extendWidth: number = 0, drawStem: boolean = true){
        let positions = [];
        let rest = false;
        let [ds, addDot] = convertDuration(this.noteValue);

        if(this.modifier && this.modifier.rest) rest = true;
        for(let i = 0; i < 6; i++){
            let fret: string | number = "";
            if(this.stringContent[i] !== -1 && !rest)fret = this.stringContent[i];
            positions.push({str: i+1, fret});
        }
        if(rest) ds += "r";
        this.tabNote = new Flow.TabNote({positions: positions, duration: ds}, !rest && drawStem, extendWidth);
        // currently assume note with float note value as note with dot
        if(addDot) this.tabNote.addDot();
        return this.tabNote;
    }
}

export class StaveNote {
    clef: string = "";
    noteValue: number;
    keys: string[];
    modifier: any;
    userData: any;
    staveNote: Flow.StaveNote;

    constructor(data: {noteValue: number, keys: string[], modifiers?: any, modifier?: any}){
        Object.assign(this, data);
    }

    makeFlowStaveNote(){
        let duration = this.noteValue;
        let [ds, addDot] = convertDuration(this.noteValue);

        this.staveNote = new Flow.StaveNote({duration: ds, keys: this.keys});
        if(addDot) this.staveNote.addDotToAll();
        return this.staveNote;
    }
}

// conver duration number to string with modifier and decide if need dot
function convertDuration(duration: number): [string, boolean]{
    let addDot = false;
    let ds = "";
    if(Math.floor(duration) != duration){
        duration = Math.round(duration * 3 / 2);
        addDot = true;
        ds = duration.toString() + "d";
    }else{
        ds = duration.toString();
    }
    return [ds, addDot];
}