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

                    targetDate = targetDate.join('').split('/')

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
    let filteredArray = []

    const selectedNodesList = document.querySelectorAll('.selected')

    let selectedNodesListNames = []
    let filters = []

    if (selectedNodesList.length !== 0) {
        selectedNodesList.forEach(node => {
            selectedNodesListNames.push(node.classList[0].slice(4))
            filters.push(document.querySelector(`#input-${node.classList[0].slice(4)}`))
        })
    }

    const keys = filters.map((header, index) => {
        if (header.value !== '')
            return headers[index]
    }).filter(header => header !== undefined)

    const values = filters.map(filter => {
        if (filter.value !== '')
            return filter.value
    }).filter(filter => filter !== undefined)

    filteredArray = data.filter(e => {
        return keys.every(a => {
            return values.includes(e[a])
        })
    })

    filteredArray.unshift(headers)

    console.log(filteredArray)
    return filteredArray
}