function sma(arr, length) {
    const result = [];
    let sum = 0;

    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
        if (i >= length - 1) {
            result.push(sum / length);
            sum -= arr[i - length + 1];
        }
    }

    return result;
}

export default sma;