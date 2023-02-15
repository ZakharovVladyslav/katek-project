export const getAllValues = (array, headers) => {
      const resultArray = []
      const timeKeys = ['tLogIn', 'tLogOut', 'tLastAcc']
      const valuesMap = new Map()

      const mapHeaders = headers.filter(header => !timeKeys.includes(header))

      mapHeaders.forEach(header => {
            valuesMap.set(`${header}`, [`----   ${header.toUpperCase()}   ----`])
      })

      array.forEach(obj => {
            for (let key of Object.keys(obj)) {
                  if (headers.includes(key) && !timeKeys.includes(key)) {
                        const arr = valuesMap.get(`${key}`)
                        arr.push(obj[key])
                  }
            }
      })

      valuesMap.forEach(arr => {
            arr = arr.filter(elem => elem !== '')

            if (arr.length > 2)
                  resultArray.push(arr)
      })

      return Array.from(new Set(resultArray.flat(Infinity)))
}