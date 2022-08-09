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

let timer = new Timer(fps = 10)

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

WebAssembly.instantiateStreaming(fetch('./static/js/wasm/gol/game.wasm'), importObject)
.then((results) =>
{
    const ww = new WazzupWasm(results)

    const memory = ww.getExport('memory'),
        createCell = ww.getExport('createCell'),
        isCellEmpty = ww.getExport('isCellEmpty'),
        getColor = ww.getExport('getColor'),
        getXCoordinate = ww.getExport('getXCoordinate'),
        getYCoordinate = ww.getExport('getYCoordinate'),
        getBoardHeight = ww.getExport('getBoardHeight'),
        getBoardWidth = ww.getExport('getBoardWidth'),
        getCellSize = ww.getExport('getCellSize');

    const movement = new Movement()

    createCell(10, 10);
    // createCell(-10, -10);
    // createCell(10, -10);
    createCell(10, 10);
    createCell(0, 10);
    // createCell(0, -10);
    // createCell(-10, 0);
    createCell(10, 10);
    createCell(0, 0);
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

                // console.log(x, y);

                // const size = new Int32Array(memory.buffer, 0, 1);
                // const colorAddr = getColor(size.byteOffset, (x+y)%10);
                // const colorArray = new Int8Array(memory.buffer, colorAddr, size[0]);
                // const color = String.fromCharCode.apply(null, colorArray)
                let xCoord = getXCoordinate(x, y);
                let yCoord = getYCoordinate(x, y);

                ctx.fillStyle = 'red';
                ctx.fillRect(xCoord, yCoord, cellSize, cellSize);

                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.font = 'bold 30px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`(${x}, ${y})`, x*cellSize + (cellSize / 2), y*cellSize + (cellSize / 2) + 11);
            }
        }
    }

    function main() {
        window.requestAnimationFrame(main);
            
        const canvas = document.querySelector('canvas#gol-canvas')
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
    
    window.addEventListener('keydown', (evt) => {
        console.log(evt)
    });

    
    /*
    const size = new Int32Array(memory.buffer, 0, 1);
    const resultAddr = factorial(size.byteOffset, Number(n));
    const resultArray = new Int32Array(memory.buffer, resultAddr, size[0]);
    */
});