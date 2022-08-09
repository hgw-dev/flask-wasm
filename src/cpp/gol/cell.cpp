#include "cell.hpp"

Cell::Cell(int x, int y, int boardScaleX, int boardScaleY) : 
    xGrid(x), yGrid(y), 
    xGridNext(x), yGridNext(y),
    x(boardScaleX * x), y(boardScaleY * y), 
    xNext(boardScaleX * x), yNext(boardScaleY * y),
    isValid(true)
{

}


void Cell::setLocation(int newX, int newY)
{
    xGridNext = newX;
    yGridNext = newY;
    xNext = boardScaleX * newX;
    yNext = boardScaleY * newY;
}