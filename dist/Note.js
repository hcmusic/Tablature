import { Flow } from "vexflow";
export class TabNote {
    constructor(data = {}) {
        if (data[0]) {
            this[0] = data[0];
            this[1] = data[1] || [-1, -1, -1, -1, -1, -1];
            this[2] = data[2] || null;
            return;
        }
        this[0] = data.noteValue || 4;
        this[1] = data.stringContent || [-1, -1, -1, -1, -1, -1];
        this[2] = data.userData || null;
    }
    get noteValue() {
        return this[0];
    }
    set noteValue(l) {
        this[0] = l;
    }
    get stringContent() {
        return this[1];
    }
    set stringContent(v) {
        this[1] = v;
    }
    get userData() {
        return this[2];
    }
    set userData(v) {
        this[2] = v;
    }
    makeFlowTabNote(extendWidth = 0) {
        let positions = [];
        let duration = this.noteValue;
        if (Math.floor(duration) != duration) {
            duration = Math.round(duration * 3 / 2);
        }
        for (let i = 0; i < 6; i++) {
            let fret = "";
            if (this.stringContent[i] !== -1)
                fret = this.stringContent[i];
            positions.push({ str: i + 1, fret });
        }
        this.tabNote = new Flow.TabNote({ positions: positions, duration: duration.toString() }, true, extendWidth);
        return this.tabNote;
    }
}
// type tabNote = {positions : {str : number, fret : number}[],
//                 duration : string,
//                 type? : string,
//                 dots? : number,
//# sourceMappingURL=Note.js.map