#include "cell.hpp"

Cell::Cell(int xx, int yy, int cellSize) : 
    xGrid(xx), yGrid(yy), 
    x(cellSize * xx), y(cellSize * yy), 
    cellSize(cellSize),
    isValid(true)
{
}