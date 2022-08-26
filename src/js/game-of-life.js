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

class WasmInterface {
    constructor(results){
        this.exports = results.instance.exports

        // console.log(Object.keys(this.exports))
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

        this.setSpeed(0)
    }
    setSpeed(x){
        // 1 >= (current speed + 1) < 10
        let speed = x % 10;
        speed = speed === 0 ? 1 : speed;

        this.speed = speed;
        this.frameDuration = 1000 / this.speed;

        document.querySelector('button#speedup')
            .setAttribute('level', Number(this.speed))
    }
    incrementSpeed(){
        this.setSpeed(this.speed + 1);
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

const wi = new WasmInterface(results),
    timer = new Timer(),
    movement = new Movement();

const memory = wi.getExport('memory'),
    createCell = wi.getExport('createCell'),
    deleteCell = wi.getExport('deleteCell'),
    getColor = wi.getExport('getColor'),
    inBounds = wi.getExport('inBounds'),
    isCellEmpty = wi.getExport('isCellEmpty'),
    isCellAlive = wi.getExport('isCellAlive'),
    getXCoordinate = wi.getExport('getXCoordinate'),
    getYCoordinate = wi.getExport('getYCoordinate'),
    getBoardHeight = wi.getExport('getBoardHeight'),
    getBoardWidth = wi.getExport('getBoardWidth'),
    getCellSize = wi.getExport('getCellSize'),
    step = wi.getExport('step');

const cellSize = getCellSize();

class Listeners {
    static setPosition(evt){
        const rect = canvas.getBoundingClientRect(),
            x = Number(evt.clientX) - Number(rect.left),
            y = Number(evt.clientY) - Number(rect.top);
        mouseX = x;
        mouseY = y;

        const mouse = document.querySelector('span#mouse')
        mouse.textContent = `(${mouseX}, ${mouseY})`

        const cell = document.querySelector('span#cell')
        cell.textContent = `(${Math.floor(mouseX/cellSize)}, ${Math.floor(mouseY/cellSize)})`
    }
    static rClick(x, y){
        deleteCell(x, y);
    }
    static lClick(x, y){
        if (inBounds(x, y)){
            if (!isCellAlive(x, y)){
                createCell(x, y);
            } else {
                deleteCell(x, y);
            }
        }
    }
    static clickCell(lIsDown, rIsDown, evt){
        Listeners.setPosition(evt);

        if (lIsDown){
            Listeners.lClick(Math.floor(mouseX/cellSize), Math.floor(mouseY/cellSize))
        } else if (rIsDown) {
            Listeners.rClick(Math.floor(mouseX/cellSize), Math.floor(mouseY/cellSize))
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
        document.querySelector('button#step')
            .addEventListener('click', () => {
                step();
            })
    }
    static stepIfSimEnabled(){
        if (document.querySelector('button#sim').hasAttribute('enabled')){
            step();
        }
    }
    static sim() {
        document.querySelector('button#sim')
            .addEventListener('click', ({target}) => { 
                target.toggleAttribute('enabled')
            })
    }
    static speedUp() {
        document.querySelector('button#speedup')
            .addEventListener('click', () => timer.incrementSpeed());
    }
    static initialize() {
        Listeners.step();
        Listeners.sim()
        Listeners.speedUp()
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
                Listeners.stepIfSimEnabled()
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
                // initializes an empty field
                if (isCellEmpty(x, y)){
                    createCell(x, y);
                    deleteCell(x, y);
                }
                
                const xCoord = getXCoordinate(x, y);
                const yCoord = getYCoordinate(x, y);

                if (isCellAlive(x, y)){    
                    // const color = getColor(x, y);
                    // ctx.fillStyle = "#" + color.toString(16);
                    ctx.fillStyle = 'gray'
                    ctx.fillRect(xCoord, yCoord, cellSize, cellSize);
                }
                
                if (Math.floor(mouseX/cellSize) == x && Math.floor(mouseY/cellSize) == y){
                    ctx.strokeStyle = 'blue';
                    ctx.shadowColor = 'blue';
                    ctx.shadowBlur = 10;
                    ctx.lineWidth = 5;
                } else {
                    ctx.strokeStyle = 'black'
                    ctx.shadowColor = null;
                    ctx.shadowBlur = null;
                    ctx.lineWidth = 1;    
                }
                ctx.strokeRect(xCoord, yCoord, cellSize, cellSize);
            }
        }
    }
}

canvas.setAttribute("width",getBoardWidth()*cellSize)
canvas.setAttribute("height",getBoardHeight()*cellSize)
canvas.oncontextmenu= () => false;

window.requestAnimationFrame(() => Canvas.initialize());
Listeners.initialize();

});