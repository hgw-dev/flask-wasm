#include <emscripten.h>
#include <iostream>
#include "fibb.cpp"
#include "matrix.cpp"

using namespace std;

EMSCRIPTEN_KEEPALIVE
extern "C" {
  int main() {
    std::cout << "fibb(4) = " << fibb(4) << std::endl;
    std::cout << "fibb(5) = " << fibb(5) << std::endl;
    std::cout << "fibb(9) = " << fibb(9) << std::endl;
    return 0;
  }
  void matrixmult(double* matrixA, double* matrixB, double* matrixC, int length){
    
  }
  int add(int x){
    return fibb(x);
  }
}