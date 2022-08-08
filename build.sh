rm -rf static
mkdir -p static/js/wasm
mkdir -p static/css

export SRC_CPP=src/cpp/app.cpp
export DEST_JS=static/js/wasm/app.html
export EXPORTED_FUNCTIONS='["_add","_main"]'
export EXPORTED_RUNTIME_METHODS='cwrap'

# emcc src/cpp/app.cpp -o static/app.js -s EXPORTED_FUNCTIONS='_add' -s EXPORTED_RUNTIME_METHODS='cwrap' -s EXPORT_ES6=1 -s MODULARIZE=1
# em++ $SRC_CPP -s WASM=1 -o $DEST_JS \
#     -s EXPORTED_FUNCTIONS=$EXPORTED_FUNCTIONS \
#     -s EXPORTED_RUNTIME_METHODS=$EXPORTED_RUNTIME_METHODS \
#     -s EXPORT_ES6=1 \
#     -s MODULARIZE=1
emcc -g --source-map-base \
    -gsource-map --no-entry \
    -s STANDALONE_WASM \
    src/cpp/2048/box.cpp src/cpp/2048/game_logic.cpp \
    -o static/js/wasm/game_logic.html