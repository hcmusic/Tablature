import { Flow } from "vexflow"
export type TabSection = TabNote[];
export class TabNote {
    0: number; //duration
    1: number[]; // fret
    2: any; //user data
    constructor(data: {noteValue?: number, stringContent?: number[], userData?: any, 0?: number, 1?: number[], 2?: any} = {}){
        if(data[0]){
            this[0] = data[0];
            this[1] = data[1] || [-1, -1, -1, -1, -1, -1];
            this[2] = data[2] || null;
            return;
        }
        this[0] = data.noteValue || 4;
        this[1] = data.stringContent || [-1, -1, -1, -1, -1, -1];
        this[2] = data.userData || null;
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
    get userData(){
        return this[2];
    }
    set userData(v: any){
        this[2] = v;
    }

    makeFlowTabNote(extendWidth: number = 0){
        let positions = [];
        let duration = this.noteValue;
        if(Math.floor(duration) != duration){
            duration = Math.round(duration * 3 / 2);
        }
        for(let i = 0; i < 6; i++){
            let fret: string | number = "";
            if(this.stringContent[i] !== -1)fret = this.stringContent[i];
            positions.push({str: i+1, fret});
        }
        return new Flow.TabNote({positions: positions, duration: duration.toString()}, true, extendWidth);
    }
}
// type tabNote = {positions : {str : number, fret : number}[],
//                 duration : string,
//                 type? : string,
//                 dots? : number,