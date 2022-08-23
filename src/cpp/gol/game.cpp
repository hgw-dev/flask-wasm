#include <emscripten.h>
#include <array>
#include <stdio.h>
#include <string.h>

#include "cell.hpp"

typedef long int i32;

static int turn = 0;
static constexpr int cellSize = 30;
static constexpr int canvasWidth = 1710;
static constexpr int canvasHeight = 300;
// static constexpr int canvasWidth = 1200;
// static constexpr int canvasHeight = 600;

static constexpr int boardSizeX = canvasWidth / cellSize;
static constexpr int boardSizeY = canvasHeight / cellSize;

static std::array<std::array<Cell, boardSizeX>, boardSizeY> board;

extern "C" int str_len(const char* p)
{
    return std::strlen(p);
}

extern "C"
{

EMSCRIPTEN_KEEPALIVE
bool isCellEmpty(int x, int y)
{
    return board[y][x].isValid == false;
}

EMSCRIPTEN_KEEPALIVE
bool isCellAlive(int x, int y)
{
    return board[y][x].isAlive == true;
}

EMSCRIPTEN_KEEPALIVE
bool inBounds(int x, int y)
{
    return x >= 0 && x < boardSizeX && y >= 0 && y < boardSizeY;
}

EMSCRIPTEN_KEEPALIVE
void createCell(int x, int y)
{
    if (inBounds(x, y)){
        if (isCellEmpty(x, y)){
            board[y][x] = Cell(x, y, cellSize);
            board[y][x].color = 255;
            // board[y][x].color = (int) (emscripten_random() * 16777215);
        } else {
            board[y][x].isAlive = true;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
void deleteCell(int x, int y)
{
    if (inBounds(x, y)){
        if (isCellAlive(x, y)){
            board[y][x].isAlive = false;
        }
    }
}

EMSCRIPTEN_KEEPALIVE
int neighborAliveCount(int x, int y)
{
    int count = 0;
    for (int i = -1; i <= 1; i++){
        for (int j = -1; j <= 1; j++){
            if (i == 0 && j == 0){
                continue;
            }
            int offX = 0;
            int offY = 0;

            if (x+j >= boardSizeX){
                offX = -boardSizeX;
            } else if (x+j < 0){
                offX = boardSizeX;
            }
            if (y+i >= boardSizeY){
                offY = -boardSizeY;
            } else if (y+i < 0){
                offY = boardSizeY;
            }

            if (isCellAlive(x+j+offX, y+i+offY)){
                count++;
            }
        }
    }
    return count;
}

EMSCRIPTEN_KEEPALIVE
bool willCellBeAlive(int x, int y)
{
    int count = neighborAliveCount(x, y);

    if (isCellAlive(x, y) && (count == 2 || count == 3)){
        return true;
    }
    if (!isCellAlive(x, y) && count == 3){
        return true;
    }
    return false;
}

EMSCRIPTEN_KEEPALIVE
int step()
{
    for (int i = 0; i < boardSizeY; i++){
        for (int j = 0; j < boardSizeX; j++){
            board[i][j].willBeAlive = willCellBeAlive(j, i);
        }
    }
    for (int i = 0; i < boardSizeY; i++){
        for (int j = 0; j < boardSizeX; j++){
            board[i][j].isAlive = board[i][j].willBeAlive;
            if (board[i][j].willBeAlive){
                createCell(j, i);
            }
            if (!board[i][j].willBeAlive){
                deleteCell(j, i);
            }
        }
    }

    return turn++;
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
int getColor(int x, int y)
{
    return board[y][x].color;
}

}