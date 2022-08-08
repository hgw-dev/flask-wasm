pip3 install -r requirements.txt

rm -rf static
mkdir -p static/js/wasm
mkdir -p static/css

export SRC_CPP=src/cpp/app.cpp
export DEST_JS=static/js/wasm/app.js
export EXPORTED_FUNCTIONS='["_add","_main"]'
export EXPORTED_RUNTIME_METHODS='cwrap'

# emcc src/cpp/app.cpp -o static/app.js -s EXPORTED_FUNCTIONS='_add' -s EXPORTED_RUNTIME_METHODS='cwrap' -s EXPORT_ES6=1 -s MODULARIZE=1
em++ $SRC_CPP -s WASM=1 -o $DEST_JS \
    -s EXPORTED_FUNCTIONS=$EXPORTED_FUNCTIONS \
    -s EXPORTED_RUNTIME_METHODS=$EXPORTED_RUNTIME_METHODS \
    -s EXPORT_ES6=1 \
    -s MODULARIZE=1

cp src/js/* static/js
cp src/css/* static/css