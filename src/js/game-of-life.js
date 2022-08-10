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
    constructor(fps){
        this.start = this.now;
        this.delta = 0;

        this.fps = fps
        this.frameDuration = 1000/fps
    }
    get now(){
        return Date.now();
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

let timer = new Timer(fps = 60)

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

const canvas = document.querySelector('canvas#gol-canvas')
let mouseX, mouseY;

const mouseCoordsInCanvas = (evt) => {
    const rect = canvas.getBoundingClientRect(),
        x = evt.clientX - rect.left,
        y = evt.clientY - rect.top;
    mouseX = x;
    mouseY = y;
}

WebAssembly.instantiateStreaming(fetch('./static/js/wasm/gol/game.wasm'), importObject)
.then((results) =>
{
    const ww = new WazzupWasm(results)

    const memory = ww.getExport('memory'),
        createCell = ww.getExport('createCell'),
        getColor = ww.getExport('getColor'),
        isCellEmpty = ww.getExport('isCellEmpty'),
        getXCoordinate = ww.getExport('getXCoordinate'),
        getYCoordinate = ww.getExport('getYCoordinate'),
        getBoardHeight = ww.getExport('getBoardHeight'),
        getBoardWidth = ww.getExport('getBoardWidth'),
        getCellSize = ww.getExport('getCellSize');

    const movement = new Movement()
    
    const coords = [
        [10, 10], [20, 20], [25,30],
        [0, 30], [30, 20], [0, 0]
    ]
    coords.forEach(([x, y]) => {
        console.log(x, y)
        createCell(x, y);
    });

    const cellSize = getCellSize();
    
    function draw(canvas, ctx){
        ctx.fillStyle = 'rgb(240,240,240)'
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const xSize = getBoardWidth();
        const ySize = getBoardHeight();

        for (let x = 0; x < xSize; x++) {
            for (let y = 0; y < ySize; y++){
                if (isCellEmpty(x, y)){
                    continue;
                }

                
                const xCoord = getXCoordinate(x, y);
                const yCoord = getYCoordinate(x, y);
                const color = getColor(x, y);
                
                ctx.fillStyle = "#" + color.toString(16);
                ctx.fillRect(xCoord, yCoord, cellSize, cellSize);

                ctx.fillStyle = 'purple';
                ctx.fillRect(mouseX, mouseY, cellSize, cellSize);

                // ctx.fillStyle = 'rgb(0, 0, 0)';
                // ctx.font = 'bold 30px Arial';
                // ctx.textAlign = 'center';
                // ctx.fillText(`(${x}, ${y})`, xCoord + (cellSize / 2), yCoord + (cellSize / 2) + 11);
            }
        }
    }

    let isDown = false;
    window.addEventListener('mousedown', (evt) => {
        isDown = true;
    });
    window.addEventListener('mouseup', (evt) => {
        isDown = false;
    });
    // });
    window.addEventListener('mousemove', (evt) => {
        mouseCoordsInCanvas(evt);
    // window.addEventListener('click', (evt) => {
        isDown && createCell(mouseX/cellSize, mouseY/cellSize)
    });

    function main() {
        window.requestAnimationFrame(main);
        if (canvas.getContext){
            const ctx = canvas.getContext('2d');

            ctx.save();
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            while (timer.isNewFrame){
                movement.update(() => true)

                timer.endFrame();
            }

            draw(canvas, ctx);
    
            ctx.restore();
        }
    }

    window.requestAnimationFrame(main);
    
    /*
    const size = new Int32Array(memory.buffer, 0, 1);
    const resultAddr = factorial(size.byteOffset, Number(n));
    const resultArray = new Int32Array(memory.buffer, resultAddr, size[0]);
    */
});