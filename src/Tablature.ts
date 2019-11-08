import * as Vex from "vexflow";

export class tablature {
    private pivot: HTMLElement;
    private renderer: Vex.Flow.Renderer;
    private context: Vex.IRenderContext;
    //private data: note_struct[][];

    constructor(){

    }

    attach(div: string){
        if(this.renderer){
            console.error("already attach to an element");
            return;
        }
        let pivot = document.getElementById(div);
        if(!pivot){
            console.error(`cannot find element by id: ${div}`);
            return;
        }
        this.renderer = new Vex.Flow.Renderer(pivot, Vex.Flow.Renderer.Backends.SVG);
        this.context = this.renderer.getContext();
    }
}