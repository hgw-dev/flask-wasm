export default (x) => {
    let factorial = 1.0
    for(let i = 1; i <= x; ++i) {
        factorial *= i;
    }
    return factorial
}