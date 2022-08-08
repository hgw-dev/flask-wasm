export default  (fn) => {
    let start = performance.now();
    let result = fn();
    let duration = performance.now()

    console.log(result, duration - start);
}