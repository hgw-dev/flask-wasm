#include "cell.hpp"

Cell::Cell(int x, int y, int cellSize) : 
    xGrid(x), yGrid(y), 
    xGridNext(x), yGridNext(y),
    x(cellSize * x), y(cellSize * y), 
    xNext(cellSize * x), yNext(cellSize * y),
    cellSize(cellSize),
    isValid(true), isAlive(true)
{
}

void Cell::setLocation(int newX, int newY)
{
    xGridNext = newX;
    yGridNext = newY;
    xNext = cellSize * newX;
    yNext = cellSize * newY;
}