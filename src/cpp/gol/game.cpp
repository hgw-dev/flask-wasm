#include <emscripten.h>
#include <array>

#include "cell.hpp"

typedef long int i32;

static constexpr int cellSize = 50;
static constexpr int canvasWidth = 800;
static constexpr int canvasHeight = 400;

static constexpr int boardSizeX = canvasWidth / cellSize;
static constexpr int boardSizeY = canvasHeight / cellSize;

static std::array<std::array<Cell, boardSizeX>, boardSizeY> board;
static int boxesIteratedCount = 0;
static bool canCreateNewCell = false;

extern "C"
{

EMSCRIPTEN_KEEPALIVE
void createCell(int x, int y)
{
    board[y][x] = Cell(x, y, boardSizeX, boardSizeY);
}

EMSCRIPTEN_KEEPALIVE
bool isCellEmpty(int x, int y)
{
    return board[y][x].isValid == false;
}

EMSCRIPTEN_KEEPALIVE
int getBoardHeight()
{
    return boardSizeY;
}

EMSCRIPTEN_KEEPALIVE
int getBoardWidth()
{
    return boardSizeX;
}

EMSCRIPTEN_KEEPALIVE
int getCellSize()
{
    return cellSize;
}

EMSCRIPTEN_KEEPALIVE
int getXCoordinate(int x, int y)
{
    return board[y][x].x;
}

EMSCRIPTEN_KEEPALIVE
int getYCoordinate(int x, int y)
{
    return board[y][x].y;
}

EMSCRIPTEN_KEEPALIVE
const char* getColor(i32* size, int number)
{
    int log2 = -1;
    while (number >>= 1) ++log2;
 
    const char* colors[10] = { 
        "rgb(222, 229, 24)",
        "rgb(239, 194, 0)",
        "rgb(247, 157, 1)",
        "rgb(246, 121, 36)",
        "rgb(236, 85, 57)",
        "rgb(217, 49, 74)",
        "rgb(191, 9, 87)",
        "rgb(157, 0, 97)",
        "rgb(117, 0, 102)",
        "rgb(71, 9, 100)"
    };
    
    if (log2 >= 10){
        log2 = 9;
    }

    *size = i32(strlen(colors[log2]));
    const char* num = colors[log2]; 

    return num;
}

// EMSCRIPTEN_KEEPALIVE
// bool update(int keyXMove, int keyYMove)
// {

// }

}