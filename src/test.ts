import * as Vex from "vexflow"
let VF = Vex.Flow;

var div = document.getElementById("boo")
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

renderer.resize(1300, 500);
var context = renderer.getContext();
context.setFont("Arial", 10, 12).setBackgroundFillStyle("rgba(255,0,0,0.5)");

let pos = [10, 40];
let noteNumber = 0;
let secctionNumber = 1;
let svgGroupArray: SVGElement[] = [];
var stave = new VF.TabStave(pos[0], pos[1], 300);
stave.addClef("tab").addTimeSignature("4/4")
var notes: Vex.Flow.TabNote[][] = [[]];
stave.setContext(context).draw();
let sg = 0;
function x(){
    if(notes[secctionNumber - 1].length >= 8){
        notes.push([]);
        if(secctionNumber%4==0){
            pos[0] = 10;
            pos[1] += 120;
            stave = new VF.TabStave(pos[0], pos[1], 300);
            stave.addClef("tab").addTimeSignature("4/4");
            renderer.resize(1300, pos[1]+150);
        }else{
            pos[0] += 300;
            stave = new VF.TabStave(pos[0], pos[1], 300);
        }
        secctionNumber++;
        stave.setContext(context).draw();
    }
    if(svgGroupArray[secctionNumber - 1])((<any>context).svg as SVGElement).removeChild(svgGroupArray[secctionNumber - 1]);
    let group = ((context as any).openGroup()) as SVGElement;
    let newNote = new VF.TabNote({positions: [{str: 5, fret: "   3"}],duration: "8"}, true, 60);
    sg++;
    newNote.addDot();
    notes[secctionNumber - 1].push(newNote);
    VF.Formatter.FormatAndDraw(context, stave, notes[secctionNumber - 1]);
    (context as any).closeGroup();
    svgGroupArray[secctionNumber - 1] = group;
    document.documentElement.scrollTop+=1000
}
let s: any;
(window as any).gg = () => {s = setInterval(x, 100)};
(window as any).gx = () => {clearInterval(s)};
x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();
//(window as any).gg();