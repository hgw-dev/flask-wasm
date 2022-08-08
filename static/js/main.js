import Module from './wasm/app.js'
import addJs from './fibb.js'
import timeFn from './timer.js'

Module().then(function(mymod) {
    const addCpp = mymod.cwrap('add', 'number', ['number']);

    timeFn(() => addCpp(4))
    timeFn(() => addCpp(5))
    timeFn(() => addCpp(9))
    timeFn(() => addCpp(10))

    timeFn(() => addJs(4))
    timeFn(() => addJs(5))
    timeFn(() => addJs(9))
    timeFn(() => addJs(10))
}); 