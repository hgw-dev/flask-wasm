long fibb(int x) {
    long factorial = 1.0;
    for(int i = 1; i <= x; ++i) {
        factorial *= i;
    }
    return factorial;
}