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

WebAssembly.instantiateStreaming(fetch('./static/js/wasm/factorial.wasm'), importObject)
.then((results) =>
{
    const computeFactorial = (n) => {
        const { memory, factorial } = results.instance.exports;

        const size = new Int32Array(memory.buffer, 0, 1);
        const resultAddr = factorial(size.byteOffset, Number(n));
        const resultArray = new Int32Array(memory.buffer, resultAddr, size[0]);
    
        return resultArray
    }

    const computeBigfacts = (n) => {
        const { memory, bigfacts } = results.instance.exports;

        const resultAddr = bigfacts(Number(n));
        const resultArray = new Int32Array(memory.buffer, resultAddr, 500);
        const result = resultArray.reverse().join('').replace(/^0*/, '');

        return result
    }

    document.addEventListener('click', (evt) => {
        if (evt.target === document.querySelector('button#expand')){
            const input = document.querySelector('input#fact')
            
            const result = computeBigfacts(input.value)

            document.querySelector("#result span#pages").innerText = ` \
                ${input.value}! = ${result} \
            `;
        }
    });
});