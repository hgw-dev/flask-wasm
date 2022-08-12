var memory = new WebAssembly.Memory({initial:1});

var importObject = {
    js: { mem: memory },
    env: {
        emscripten_random: function()
        {
            return Math.random();
        }
    },
    wasi_snapshot_preview1: {}
};

WebAssembly.instantiateStreaming(fetch('./static/js/wasm/gol/game.wasm'), importObject)
.then((results) =>
{   
    
const canvas = document.querySelector('canvas#gol-canvas')

let mouseX, mouseY;

class WazzupWasm {
    constructor(results){
        this.exports = results.instance.exports

        console.log(Object.keys(this.exports))
    }

    getExport(fn){
        if (fn in this.exports){
            return this.exports[fn]
        }
        console.error(`${fn}: No export found by that name.`)
    }
}

class Timer {
    constructor(){
        this.start = this.now;
        this.delta = 0;

        this.frameDuration = 1000
    }
    get now(){
        return performance.now();
    }
    get recalculate(){
        const now = this.now,
            elapsed = now - this.start;
            
        this.start = now;
        this.delta += elapsed;

        return this.delta;
    }
    get isNewFrame(){
        return this.recalculate >= this.frameDuration;
    }
    endFrame(){
        this.delta -= this.frameDuration;
    }
}

class Movement {
    constructor(){
        this.reset()    
    }
    reset(){
        this.xMove = 0;
        this.yMove = 0;
    }
    update(fn){
        if (fn(this.xMove, this.yMove)){
            this.reset();
        }
    }
}

const ww = new WazzupWasm(results),
    timer = new Timer(),
    movement = new Movement();

const memory = ww.getExport('memory'),
    createCell = ww.getExport('createCell'),
    deleteCell = ww.getExport('deleteCell'),
    getColor = ww.getExport('getColor'),
    isCellEmpty = ww.getExport('isCellEmpty'),
    isCellAlive = ww.getExport('isCellAlive'),
    getXCoordinate = ww.getExport('getXCoordinate'),
    getYCoordinate = ww.getExport('getYCoordinate'),
    getBoardHeight = ww.getExport('getBoardHeight'),
    getBoardWidth = ww.getExport('getBoardWidth'),
    getCellSize = ww.getExport('getCellSize'),
    step = ww.getExport('step');

const cellSize = getCellSize();

class Listeners {
    static setPosition(evt){
        const rect = canvas.getBoundingClientRect(),
            x = evt.clientX - rect.left,
            y = evt.clientY - rect.top;
        mouseX = x;
        mouseY = y;
    }
    static rClick(x, y){
        deleteCell(Math.floor(x), Math.floor(y));
    }
    static lClick(x, y){
        createCell(Math.floor(x), Math.floor(y));
    }
    static clickCell(lIsDown, rIsDown, evt){
        Listeners.setPosition(evt);

        if (lIsDown){
            Listeners.lClick(mouseX/cellSize, mouseY/cellSize)
        } else if (rIsDown) {
            Listeners.rClick(mouseX/cellSize, mouseY/cellSize)
        }
    }
    static mouse() {
        let lIsDown = false,
            rIsDown = false;
        window.addEventListener('mousedown', (evt) => {
            if (evt.button === 2){
                rIsDown = true;
            } else {
                lIsDown = true;
            }
            Listeners.clickCell(lIsDown, rIsDown, evt);
        });
        window.addEventListener('mouseup', (evt) => {
            rIsDown = false;
            lIsDown = false;
        });
        window.addEventListener('mousemove', (evt) => {
            Listeners.clickCell(lIsDown, rIsDown, evt)
        });

    }
    static step() {
        const stepBtn = document.querySelector('button#step');

        stepBtn.addEventListener('click', () => {
            step();
        })
    }
    static initialize() {
        Listeners.step();
        Listeners.mouse();
    }
}

class Canvas {
    static initialize() {
        window.requestAnimationFrame(() => Canvas.initialize());
        if (canvas.getContext){
            const ctx = canvas.getContext('2d');

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            while (timer.isNewFrame){
                movement.update(() => true)
                timer.endFrame();
            }

            Canvas.draw(canvas, ctx);

            ctx.restore();
        }
    }
    
    static draw(canvas, ctx){
        ctx.fillStyle = 'rgb(240,240,240)'
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < getBoardHeight(); y++){
            for (let x = 0; x < getBoardWidth(); x++) {
                if (!isCellAlive(x, y)){
                    continue;
                }
                
                const xCoord = getXCoordinate(x, y);
                const yCoord = getYCoordinate(x, y);
                const color = getColor(x, y);

                ctx.fillStyle = "#" + color.toString(16);
                ctx.fillRect(xCoord, yCoord, cellSize, cellSize);
                
                ctx.fillStyle = 'purple';
                ctx.fillRect(mouseX, mouseY, cellSize, cellSize);
            }
        }
    }
}

canvas.setAttribute("width",getBoardWidth()*cellSize)
canvas.setAttribute("height",getBoardHeight()*cellSize)
canvas.oncontextmenu=() => false;
window.requestAnimationFrame(() => Canvas.initialize());
Listeners.initialize();
});