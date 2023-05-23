import CustomStorage from "../Storage/Local-Storage.js";

const Storage = new CustomStorage();

export default function DropdownValues(array, headers) {
      const resultArray = [];
      const timeKeys = ['tLogIn', 'tLogOut', 'tLastAcc'];
      const valuesMap = new Map();

      const mapHeaders = headers.filter(header => !timeKeys.includes(header));

      mapHeaders.forEach(header => {
            valuesMap.set(`${header}`, [`---- ${header} ----`])
      })

      array.forEach(obj => {
            for (let key of Object.keys(obj)) {
                  if (headers.includes(key) && !timeKeys.includes(key)) {
                        const arr = valuesMap.get(`${key}`);
                        arr.push(obj[key]);
                  }
            }
      })

      valuesMap.forEach((arr, header) => {
            arr = arr.filter(elem => elem !== '');

            if (arr.length > 1)
                  resultArray.push(arr);

            valuesMap.set(header, arr.slice(1)); // Remove header from the array
      })

      const flattenedArray = Array.from(new Set(resultArray.flat(Infinity)));

      const valueToHeaderMap = new Map();
      array.forEach(obj => {
            for (let key of Object.keys(obj)) {
                  if (headers.includes(key) && !timeKeys.includes(key)) {
                        const value = obj[key];
                        valueToHeaderMap.set(value, key);
                  }
            }
      })

      return {
            values: flattenedArray,
            valueToHeaderMap: Object.fromEntries(valueToHeaderMap)
      };
}
