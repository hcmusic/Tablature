export var utils;
(function (utils) {
    function setAttributes(el, attr) {
        for (let k in attr) {
            el.setAttribute(k, attr[k]);
        }
    }
    utils.setAttributes = setAttributes;
    function setStyle(el, style) {
        for (let k in style) {
            el.style.setProperty(k, style[k]);
        }
    }
    utils.setStyle = setStyle;
    const noteNumber = { "C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11 };
    const regex = /^([CDEFGAB]#?)([0-9])$/;
    function noteToDecimal(note) {
        let groups = regex.exec(note);
        if (groups.length != 3)
            return -1;
        return noteNumber[groups[1]] + (Number(groups[2]) + 1) * 12;
    }
    utils.noteToDecimal = noteToDecimal;
})(utils || (utils = {}));
class ArrayFunction {
    constructor() {
        this.funcs = [];
    }
    callAll(...args) {
        this.funcs.forEach((func) => {
            func(...args);
        });
    }
    push(cbk) {
        this.funcs.push(cbk);
    }
}
;
export class Callbacks {
    constructor(eventType) {
        eventType.forEach(element => {
            this[element] = new ArrayFunction();
        });
    }
}
//# sourceMappingURL=utils.js.map