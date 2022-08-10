#include <emscripten.h>
#include <array>
#include <stdio.h>
#include <string.h>

#include "cell.hpp"

typedef long int i32;

static constexpr int cellSize = 10;
static constexpr int canvasWidth = 800;
static constexpr int canvasHeight = 400;

static constexpr int boardSizeX = canvasWidth / cellSize;
static constexpr int boardSizeY = canvasHeight / cellSize;

static std::array<std::array<Cell, boardSizeX>, boardSizeY> board;
// static int boxesIteratedCount = 0;
// static bool canCreateNewCell = false;

extern "C" int str_len(const char* p)
{
    return std::strlen(p);
}

// extern "C" void tostring(int n, char* c)
// {
//     *c = std::to_string(n);
// }

// extern "C" void std_cat(char* a, char* b)
// {
//     strcat(a, b);
// }

// char* getColor() { 
//     int cA = emscripten_random() % 16;
//     int cB = emscripten_random() % 16;


//     char hex[] = "6A";
//     int num = (int)strtol(hex, NULL, 16);  

//     char *result = color;
//     // return result;
//     // std::ostringstream color;
//     // color << "rgb(" << std::to_string(r) 
//     // << "," << std::to_string(g)
//     // << "," << std::to_string(b) 
//     // << ")";

//     // const std::string thing= color.str;
//     // const char *result = color.str().c_str();
//     // *size = i32(color.size());

//     return result;
// }

extern "C"
{

EMSCRIPTEN_KEEPALIVE
int getColor(int x, int y)
{
    return board[y][x].color;
}

EMSCRIPTEN_KEEPALIVE
bool isCellEmpty(int x, int y)
{
    return board[y][x].isValid == false;
}

bool inBounds(int x, int y)
{
    return x >= 0 && x < boardSizeX && y >= 0 && y < boardSizeY;
}

EMSCRIPTEN_KEEPALIVE
void createCell(int x, int y)
{
    if (inBounds(x, y) && isCellEmpty(x, y)){
        board[y][x] = Cell(x, y, cellSize);
        board[y][x].color = (int) (emscripten_random() * 16777215);
    }
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

// EMSCRIPTEN_KEEPALIVE
// bool update(int keyXMove, int keyYMove)
// {

// }

}