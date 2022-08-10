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
        int xGridNext = 0;
        int yGridNext = 0;
        int xNext = 0;
        int yNext = 0;
        int cellSize = 0;
        bool isValid = false;
        int color = 0;

        Cell() = default;
        Cell(int x, int y, int cellSize);
        
        void update();
        void setLocation(int newX, int newY);
};


#endif //CELL_H