export const getAllValues = (array, headers) => {
      const filters = [
            document.querySelector('#filter-input-1'),
            document.querySelector('#filter-input-2'),
            document.querySelector('#filter-input-3'),
            document.querySelector('#filter-input-4'),
            document.querySelector('#filter-input-5')
      ];
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

      valuesMap.forEach(arr => {
            arr = arr.filter(elem => elem !== '');

            if (arr.length > 1)
                  resultArray.push(arr);
      })

      return Array.from(new Set(resultArray.flat(Infinity)));
}
