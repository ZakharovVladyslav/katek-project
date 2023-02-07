function dateFilter(data) {
    const leftDate = document.getElementById('left-date-inp').value
    const rigthDate = document.getElementById('right-date-inp').value

    if (leftDate.length === 0 || rigthDate === 0)
        return data

    else {
        let newData = []

        const select = document.getElementById('date-params')
        const opt = select.options[select.selectedIndex].value

        const revertDate = (date) => {
            const arr = date.split('-').reverse()

            return `${+arr[1]}/${+arr[0]}/${+arr[2]}`
        }

        const leftDateArr = revertDate(leftDate)
        const rigthDateArr = revertDate(rigthDate)

        newData = data.filter(elem => {

            if (elem[opt] !== undefined) {
                let targetDate = elem[opt].split('')

                if (targetDate.length > 10) {
                    targetDate.length = 10

                    targetDate = targetDate.join('').split('.')

                    let date = `${+targetDate[0]}/${+targetDate[1]}/${+targetDate[2]}`

                    if (new Date(leftDateArr) <= new Date(date) && new Date(date) <= new Date(rigthDateArr))
                        return elem
                }
            }
        })

        return newData
    }
}

export default function getFilters(inputData, headers) {
    const data = dateFilter(inputData)

    let inputFields = []
    let filteredArray = []

    for (let i = 0; i < 5; i++)
        inputFields.push(document.querySelector(`#filter-input-${i + 1}`))

    inputFields = inputFields.filter(field => field.value !== '')

    const keys = Object.keys(data[0]).map(key => key)

    const values = inputFields.map(filter => {
        if (filter.value !== '')
            return filter.value
    }).filter(filter => filter !== undefined)

    console.log(data)
    console.log(keys)
    console.log(values)

    filteredArray = data.filter(obj => {
        console.log(obj)
        return keys.every(key => {
            console.log(key)
            console.log(obj[key])
            return values.includes(obj[key])
        })
    })

    console.log(filteredArray)

    filteredArray.unshift(headers)

    return filteredArray
}