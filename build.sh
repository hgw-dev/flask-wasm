rm -rf static
mkdir -p static/js/wasm
mkdir -p static/css

export SRC_CPP="src\/cpp"
export DEST_JS=static/js/wasm
export EXPORTED_FUNCTIONS='["_add","_main"]'
export EXPORTED_RUNTIME_METHODS='cwrap'

compile() {
    sources=$1
    dest=$2

    source=$(echo $sources | sed -E "s/([^ ]*)\.cpp/$SRC_CPP\/\1.cpp/g" )
    target=$DEST_JS/$dest

    emcc -g --source-map-base \
        -gsource-map --no-entry \
        -s STANDALONE_WASM \
        -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
        $source \
        -o $target
}

compile "2048/box.cpp 2048/game.cpp" game.html
compile "factorial.cpp" factorial.html
# compile "box.cpp game.cpp" game.html