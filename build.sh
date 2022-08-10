#!/bin/bash

rm -rf static
mkdir -p static/js/wasm

cp -R src/js static
cp -R src/css static

export SRC_CPP="src\/cpp"
export DEST_JS=static/js/wasm

compile() {
    sources=$1
    dest=$2

    source=$(echo $sources | sed -E "s/([^ ]*)\.cpp/$SRC_CPP\/\1.cpp/g" )

    target=$DEST_JS/$dest
    if [[ "$dest" == *"/"* ]]; then
        targetDir=$(echo $target | sed -E 's/^(.*)\/[^\/]*$/\1/')
        if [[ ! -d $targetDir ]]; then
            mkdir -p $targetDir
        fi
    fi

        # -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
        # -Wall \
    
        # -s SIDE_MODULE=0 \ 
    emcc -g --source-map-base \
        -gsource-map --no-entry \
        -s STANDALONE_WASM \
        $source \
        -o $target
}

# compile "2048/box.cpp 2048/game.cpp" 2048/game.html
# compile "factorial.cpp" factorial.html
compile "gol/cell.cpp gol/game.cpp" gol/game.html