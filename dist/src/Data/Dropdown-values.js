function removeSingleValues(arr) {
    let result = [];
    let currentHeader = null;
    let currentValues = [];
    for (let i = 0; i < arr.length; i++) {
        let currentItem = arr[i];
        if (typeof currentItem === 'string' && currentItem.startsWith('----')) {
            if (currentHeader !== null && currentValues.length > 1) {
                result.push(currentHeader, ...currentValues);
            }
            currentHeader = currentItem;
            currentValues = [];
        }
        else {
            currentValues.push(currentItem);
        }
    }
    if (currentHeader !== null && currentValues.length > 1) {
        result.push(currentHeader, ...currentValues);
    }
    return result;
}
export default function DropdownValues(array, headers) {
    const resultArray = [];
    const timeKeys = ['tLogIn', 'tLogOut', 'tLastAcc'];
    const valuesMap = new Map();
    const mapHeaders = headers.filter((header) => !timeKeys.includes(header));
    mapHeaders.forEach((header) => {
        valuesMap.set(`${header}`, [`---- ${header} ----`]);
    });
    array.forEach((obj) => {
        for (let key of Object.keys(obj)) {
            if (headers.includes(key) && !timeKeys.includes(key)) {
                const arr = valuesMap.get(`${key}`);
                arr.push(obj[key]);
            }
        }
    });
    valuesMap.forEach((arr, header) => {
        arr = arr.filter(elem => elem !== '');
        if (arr.length > 1)
            resultArray.push(arr);
        valuesMap.set(header, arr.slice(1)); // Remove header from the array
    });
    let flattenedArray = Array.from(new Set(resultArray.flat(Infinity)));
    const valueToHeaderMap = new Map();
    array.forEach((obj) => {
        for (let key of Object.keys(obj)) {
            if (headers.includes(key) && !timeKeys.includes(key)) {
                const value = obj[key];
                valueToHeaderMap.set(value, key);
            }
        }
    });
    flattenedArray = removeSingleValues(flattenedArray);
    return {
        values: flattenedArray,
        valueToHeaderMap: Object.fromEntries(valueToHeaderMap)
    };
}
