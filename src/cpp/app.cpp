#include <emscripten.h>
#include <iostream>
#include "fibb.cpp"

using namespace std;

EMSCRIPTEN_KEEPALIVE
extern "C" {
  int main() {
    std::cout << "fibb(4) = " << fibb(4) << std::endl;
    std::cout << "fibb(5) = " << fibb(5) << std::endl;
    std::cout << "fibb(9) = " << fibb(9) << std::endl;
    return 0;
  }
  int add(int x){
    return fibb(x);
  }
}