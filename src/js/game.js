var keyXMove = 0;
var keyYMove = 0;

const encode = function stringToIntegerArray(string, array) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < string.length; i++) {
      array[i] = alphabet.indexOf(string[i]);
    }
  };
  
const decode = function integerArrayToString(array) {
const alphabet = "abcdefghijklmnopqrstuvwxyz";
let string = "";
for (let i = 0; i < array.length; i++) {
    string += alphabet[array[i]];
}
return string;
};

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
WebAssembly.instantiateStreaming(fetch('./static/js/wasm/game_logic.wasm'), importObject)
.then((results) =>
{
    const { memory, caesarEncrypt, caesarDecrypt } = results.instance.exports;

    const encode = function stringToIntegerArray(string, array) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      for (let i = 0; i < string.length; i++) {
        array[i] = alphabet.indexOf(string[i]);
      }
    };

    const decode = function integerArrayToString(array) {
      const alphabet = "abcdefghijklmnopqrstuvwxyz";
      let string = "";
      for (let i = 0; i < array.length; i++) {
        string += alphabet[array[i]];
      }
      return string;
    };

    const plaintext = "helloworld";
    const myKey = 3;
    const myArray = new Int32Array(memory.buffer, 0, plaintext.length);

    encode(plaintext, myArray);
    console.log(myArray); // Int32Array(10) [7, 4, 11, 11, 14, 22, 14, 17, 11, 3]
    console.log(decode(myArray)); // helloworld

    caesarEncrypt(myArray.byteOffset, myArray.length, myKey);
    console.log(myArray); // Int32Array(10) [10, 7, 14, 14, 17, 25, 17, 20, 14, 6]
    console.log(decode(myArray)); // khoorzruog

    caesarDecrypt(myArray.byteOffset, myArray.length, myKey);
    console.log(myArray); // Int32Array(10) [7, 4, 11, 11, 14, 22, 14, 17, 11, 3]
    console.log(decode(myArray)); // helloworld

    // var isBoxEmpty = results.instance.exports.isBoxEmpty;
    // var update = results.instance.exports.update;
    // var createBox = results.instance.exports.createBox;
    // var getXCoordinate = results.instance.exports.getXCoordinate;
    // var getYCoordinate = results.instance.exports.getYCoordinate;
    // var getHeight = results.instance.exports.getHeight;
    // var getWidth = results.instance.exports.getWidth;
    // var getNumber = results.instance.exports.getNumber;
    // var getColor = results.instance.exports.getColor;
    // var getBoardSize = results.instance.exports.getBoardSize;
    
    // function keyDownEvent(e)
    // {
    //     var code = e.keyCode;
        
    //     keyXMove = 0;
    //     keyYMove = 0;
    
    //     if (code === 39) // right
    //     {
    //         console.log(getColor(5));
    //         keyXMove = 1;
    //     }
    //     else if (code === 37) // left
    //     {
    //         keyXMove = -1;
    //     }
    //     else if (code === 38) // up
    //     {
    //         keyYMove = -1;
    //     }
    //     else if (code === 40) // down
    //     {
    //         keyYMove = 1;
    //     }
    // }
    
    // createBox(0, 0, 2);

    // function draw(canvas, ctx)
    // {
    //     ctx.fillStyle = 'rgb(240, 240, 240)';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //     var boardSize = getBoardSize();
    //     for (var x = 0; x < boardSize; x++)
    //     {
    //         for (var y = 0; y < boardSize; y++)
    //         {
    //             if (isBoxEmpty(x, y))
    //             {
    //                 continue;
    //             }

    //             var xCoord = getXCoordinate(x, y);
    //             var yCoord = getYCoordinate(x, y);
    //             var height = getHeight(x, y);
    //             var width = getWidth(x, y);
    //             var number = getNumber(x, y);
    //             // var color = getColor(number);

    //             const colors = [
    //                 "rgb(222, 229, 24)",
    //                 "rgb(239, 194, 0)",
    //                 "rgb(247, 157, 1)",
    //                 "rgb(246, 121, 36)",
    //                 "rgb(236, 85, 57)",
    //                 "rgb(217, 49, 74)",
    //                 "rgb(191, 9, 87)",
    //                 "rgb(157, 0, 97)",
    //                 "rgb(117, 0, 102)",
    //                 "rgb(71, 9, 100)"
    //             ]

    //             const idx = Math.min(Math.ceil(Math.log2(number)), 10)

    //             ctx.fillStyle = colors[idx];
    //             ctx.fillRect(xCoord, yCoord, height, width);
    
    //             ctx.fillStyle = 'rgb(0, 0, 0)';
    //             ctx.font = 'bold 30px Arial';
    //             ctx.textAlign = 'center';
    //             ctx.fillText(number, xCoord + (width / 2), yCoord + (height / 2) + 11);
    //         }
    //     }
    // }
    
    // var fps = 60;
    // var startTime = Date.now();
    // var frameDuration = 1000 / fps;
    // var delta = 0;
    
    // function main()
    // {
    //     window.requestAnimationFrame(main);
    
    //     var currentTime = Date.now();
    //     var elapsedTime = currentTime - startTime;
    //     startTime = currentTime;
    
    //     delta += elapsedTime;
    
    //     var canvas = document.getElementById('canvas');
    //     if (canvas.getContext)
    //     {
    //         var ctx = canvas.getContext('2d');
    //         ctx.save();
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //         while (delta >= frameDuration)
    //         {
    //             if (update(keyXMove, keyYMove))
    //             {
    //                 keyXMove = 0;
    //                 keyYMove = 0;
    //             }
    
    //             delta -= frameDuration;
    //         }
    
    //         draw(canvas, ctx);
    
    //         ctx.restore();
    //     }
    // }
    
    // window.addEventListener('keydown', keyDownEvent);
    // window.requestAnimationFrame(main);

});