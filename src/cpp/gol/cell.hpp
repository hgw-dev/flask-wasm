#ifndef CELL_H // "include gates"
#define CELL_H

class Cell
{
    // private:
    public:
        int x = 0;
        int y = 0;
        int xGrid = 0;
        int yGrid = 0;
        int cellSize = 0;
        bool isValid = false;
        bool isAlive = false;
        bool willBeAlive = false;
        int color = 0;

        Cell() = default;
        Cell(int x, int y, int cellSize);
};


#endif //CELL_H