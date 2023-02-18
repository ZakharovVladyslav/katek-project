export const getAllValues = (array, headers) => {
      const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))
      const resultArray = []
      const timeKeys = ['tLogIn', 'tLogOut', 'tLastAcc']
      const valuesMap = new Map()

      const mapHeaders = headers.filter(header => !timeKeys.includes(header))
      const busyInputs = filters.map(filter => {
            if (filter.value !== '')
                  return filter.value
      }).filter(filter => filter !== undefined)

      mapHeaders.forEach(header => {
            valuesMap.set(`${header}`, [`---- ${header} ----`])
      })
      
      mapHeaders.forEach(header => {
            const targetArray = valuesMap.get(`${header}`)

            busyInputs.forEach(value => {
                  if (targetArray.includes(value)) {
                        console.log('deletion')
                        valuesMap.delete(`${header}`)
                  }
            })
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

            if (arr.length > 1)
                  resultArray.push(arr)
      })

      return Array.from(new Set(resultArray.flat(Infinity)))
}