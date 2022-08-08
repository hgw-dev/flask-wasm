function ijk(matrixA, matrixB, matrixC, length) {
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      for (let k = 0; k < length; k++) {
        matrixC[i * length + j] +=
          matrixA[i * length + k] * matrixB[j * length + k];
      }
    }
  }
}
