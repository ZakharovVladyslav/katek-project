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
    const prodCode = document.getElementById('ProdCode')
    const customer = document.getElementById('Customer')
    const prodName = document.getElementById('ProdName')
    const hostName = document.getElementById('HostName')
    const matNum = document.getElementById('MatNum')
    const articleNum = document.getElementById('ArticleNum')
    const wkstname = document.getElementById('WkStNmae')
    const adpNum = document.getElementById('AdpNum')
    const procName = document.getElementById('ProcName')
    const avo = document.getElementById('AVO')

    const data = dateFilter(inputData)

    const filters = [prodCode, customer, prodName, hostName, matNum, articleNum, wkstname, adpNum, procName, avo]

    const keys = filters.map((header, index) => {
        if (header.value.length != 0)
            return headers[index]
    }).filter(header => header !== undefined)

    const values = filters.map(filter => {
        if (filter.value.length != 0)
            return filter.value
    }).filter(filter => filter !== undefined)

    const filteredArray = data.filter(e => {
        return keys.every(a => {
            return values.includes(e[a])
        })
    })

    filteredArray.unshift(headers)

    return filteredArray
}