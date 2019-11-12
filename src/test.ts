import { Tablature } from "./Tablature";

var div = document.getElementById("boo")
let testTab = new Tablature();
let data: [number, number[], any][][] = [
    [ //section
        [4, [3, -1, -1, 4, -1, -1], null],// note length, [fret number, index is string number,], user data
        [4, [3, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [8, [-1, 5, 2, -1, -1, -1], null],
    ],
    [ //section
        [4, [3, -1, -1, 4, -1, -1], null],// note length, [fret number, index is string number,], user data
        [4, [3, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [8, [-1, 5, 2, -1, -1, -1], null],
    ],
    [ //section
        [4, [3, -1, -1, 4, -1, -1], null],// note length, [fret number, index is string number,], user data
        [4, [3, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [4, [-1, 5, 2, -1, -1, -1], null],
        [8, [-1, 5, 2, -1, -1, -1], null],
    ]
];
testTab.setData(data);
testTab.attach(div);
testTab.render();

// renderer.resize(1300, 500);
// var context = <Vex.Flow.SVGContext>(renderer.getContext());
// context.setFont("Arial", 10, 12).setBackgroundFillStyle("rgba(255,0,0,0.5)");

// let pos = [10, 40];
// let noteNumber = 0;
// let secctionNumber = 1;
// let svgGroupArray: SVGElement[] = [];
// var stave = new VF.TabStave(pos[0], pos[1], 300);
// stave.addClef("tab").addTimeSignature("4/4")
// var notes: Vex.Flow.TabNote[][] = [[]];
// context.createLayer("stave");
// context.createLayer("note");
// context.useLayer("stave");
// context.openGroup();
// stave.setContext(context).draw();
// context.closeGroup();
// context.useLayer("note");
// let sg = 0;
// function x(){
//     if(notes[secctionNumber - 1].length >= 8){
//         notes.push([]);
//         if(secctionNumber%4==0){
//             pos[0] = 10;
//             pos[1] += 120;
//             stave = new VF.TabStave(pos[0], pos[1], 300);
//             stave.addClef("tab").addTimeSignature("4/4");
//             renderer.resize(1300, pos[1]+150);
//         }else{
//             pos[0] += 300;
//             stave = new VF.TabStave(pos[0], pos[1], 300);
//         }
//         secctionNumber++;
//         context.useLayer("stave");
//         context.openGroup();
//         stave.setContext(context).draw();
//         context.closeGroup();
//         context.useLayer("note");
//     }
//     if(svgGroupArray[secctionNumber - 1])((<any>context).layer.svgElement as SVGElement).removeChild(svgGroupArray[secctionNumber - 1]);
//     let newNote = new VF.TabNote({positions: [{str: 5, fret: "999"}], duration: "4", dots: 4}, true, 15);
//     sg++;
//     notes[secctionNumber - 1].push(newNote);
//     let group = ((context as any).openGroup()) as SVGElement;
//     VF.Formatter.FormatAndDraw(context, stave, notes[secctionNumber - 1]);
//     (context as any).closeGroup();
//     svgGroupArray[secctionNumber - 1] = group;
//     document.documentElement.scrollTop+=1000
// }
// let s: any;
// (window as any).gg = () => {s = setInterval(x, 100)};
// (window as any).gx = () => {clearInterval(s)};
// x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();x();
// //(window as any).gg();