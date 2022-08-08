#include <emscripten.h>
#include <array>
#include <iostream>
#include <iomanip>
#include <sstream>

#include "box.hpp"

static constexpr int boardSize = 4;
static std::array<std::array<Box, boardSize>, boardSize> board;
static int boxesIteratedCount = 0;
static bool canCreateNewBox = false;

static constexpr int boxSize = 100;
static constexpr int boardScale = 100;

extern "C" {

EMSCRIPTEN_KEEPALIVE
int getRandomCoordinate()
{
    return emscripten_random() * 4;
}

EMSCRIPTEN_KEEPALIVE
bool isOutbounds(int x, int y)
{
    return x >= boardSize || x < 0 || y >= boardSize || y < 0;
}

EMSCRIPTEN_KEEPALIVE
bool isBoxEmpty(int x, int y)
{
    return board[y][x].isValid == false;
}

EMSCRIPTEN_KEEPALIVE
bool isBoxMergable(int x, int y, int number)
{
    if (isOutbounds(x, y) || isBoxEmpty(x, y))
    {
        return false;
    }

    return board[y][x].number == number && board[y][x].deleteAfterMerge == false;
}

EMSCRIPTEN_KEEPALIVE
bool isAnyBoxMoving()
{
    for (const auto& row : board)
    {
        for (const auto& box : row)
        {
            if (box.isValid && box.isMoving)
            {
                return true;
            }
        }
    }

    return false;
}

EMSCRIPTEN_KEEPALIVE
int iterateBox(int x, int xNext, int y, int yNext)
{
    if (isOutbounds(x, y) || isBoxEmpty(x, y))
    {
        return 0;
    }

    if (board[y][x].deleteAfterMerge)
    {
        board[y][x].isValid = false;
        return 1;
    }

    if (isBoxEmpty(xNext, yNext))
    {
        board[yNext][xNext] = board[y][x];
        board[yNext][xNext].setLocation(xNext, yNext);
        board[y][x].isValid = false;

        return 1;
    }
    else if (isBoxMergable(xNext, yNext, board[y][x].number))
    {
        board[y][x].setLocation(xNext, yNext);
        board[y][x].deleteAfterMerge = true;
        board[yNext][xNext].merge();

        return 1;
    }

    return 0;
}

EMSCRIPTEN_KEEPALIVE
int iterateRow(int y, int direction)
{
    int moveCount = 0;

    if (direction > 0)
    {
        for (int x = board.size() - 2; x >= 0; x--)
        {
            moveCount += iterateBox(x, x + 1, y, y);
        }
    }
    else if (direction < 0)
    {
        for (int x = 1; x < board.size(); x++)
        {
            moveCount += iterateBox(x, x - 1, y, y);
        }   
    }

    return moveCount;
}

EMSCRIPTEN_KEEPALIVE
int iterateColumn(int x, int direction)
{
    int moveCount = 0;

    if (direction > 0)
    {
        for (int y = board.size() - 2; y >= 0; y--)
        {
            moveCount += iterateBox(x, x, y, y + 1);
        }
    }
    else if (direction < 0)
    {
        for (int y = 1; y < board.size(); y++)
        {
            moveCount += iterateBox(x, x, y, y - 1);
        }   
    }

    return moveCount;
}

EMSCRIPTEN_KEEPALIVE
int iterateBoxes(int xMove, int yMove)
{
    int moveCount = 0;

    if (xMove != 0)
    {
        for (int y = 0; y < board.size(); y++)
        {
            moveCount += iterateRow(y, xMove);
        }
    }
    if (yMove != 0)
    {
        for (int x = 0; x < board.size(); x++)
        {
            moveCount += iterateColumn(x, yMove);
        }
    }

    return moveCount;
}

EMSCRIPTEN_KEEPALIVE
void createBox(int x, int y, int number)
{
    board[y][x] = Box(x, y, boardScale, boxSize, number);
}

EMSCRIPTEN_KEEPALIVE
bool update(int keyXMove, int keyYMove)
{
    for (auto& row : board)
    {
        for (auto& box : row)
        {
            if (box.isValid)
            {
                box.update();
            }
        }
    }

    int previousBoxesIteratedCount = boxesIteratedCount;
    boxesIteratedCount = iterateBoxes(keyXMove, keyYMove);

    if (previousBoxesIteratedCount > 0 && boxesIteratedCount == 0)
    {
        canCreateNewBox = true;
    }

    if (canCreateNewBox && !isAnyBoxMoving())
    {
        canCreateNewBox = false;
        int newX = 0;
        int newY = 0;
        do
        {
            newX = getRandomCoordinate();
            newY = getRandomCoordinate();
        }
        while(!isBoxEmpty(newX, newY));

        createBox(newX, newY, 2);
        return true;
    }

    return false;
}

EMSCRIPTEN_KEEPALIVE
int getBoardSize()
{
    return boardSize;
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
int getHeight(int x, int y)
{
    return board[y][x].height;
}

EMSCRIPTEN_KEEPALIVE
int getWidth(int x, int y)
{
    return board[y][x].width;
}

EMSCRIPTEN_KEEPALIVE
int getNumber(int x, int y)
{
    return board[y][x].number;
}

// EMSCRIPTEN_KEEPALIVE
// const char* getColor(int number)
// {
//     int log2 = -1;
//     while (number >>= 1) ++log2;
 
//     std::string colors[10] = { 
//         // "rgb(222, 229, 24)",
//         // "rgb(239, 194, 0)",
//         // "rgb(247, 157, 1)",
//         // "rgb(246, 121, 36)",
//         // "rgb(236, 85, 57)",
//         // "rgb(217, 49, 74)",
//         // "rgb(191, 9, 87)",
//         // "rgb(157, 0, 97)",
//         // "rgb(117, 0, 102)",
//         // "rgb(71, 9, 100)"
//     };
    
//     if (log2 >= 10){
//         log2 = 9;
//     }

//     // std::string str = "rgb(71, 9, 100)";
//     const std::string* message = *(&colors + log2);
//     char * cstr = new char [message->length()+1];
//     std::strcpy (cstr, message->c_str());

//     // return cstr(&colors + log2);
//     return cstr;
// }
}