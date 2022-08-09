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

        bool isValid = false;
        int boardScaleX = 0;
        int boardScaleY = 0;

        Cell() = default;
        Cell(int x, int y, int boardScaleX, int boardScaleY);
        
        void update();
        void setLocation(int newX, int newY);
};


#endif //CELL_H