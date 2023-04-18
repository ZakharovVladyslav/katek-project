export default function summaryRowToggle(inputArray) {
    const toggleCheckboxInput = document.querySelector('#summary-row-toggler-input')
    const table = document.querySelector('#summary-table')

    const thead = document.createElement('thead')
    const tbody = document.createElement('tbody')

    const array = [...inputArray]

    toggleCheckboxInput.addEventListener('change', e => {
        if (!toggleCheckboxInput.checked) {
            table.innerHTML = ''
            thead.innerHTML = ''
            tbody.innerHTML = ''

            const keys = ['tLatenz', 'tLatenzSumme', 'tCycle', 'tProc', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest']

            const values = array.map(object => {
                const objectValues = []

                keys.forEach(key => {
                    objectValues.push(object[key])
                })

                return objectValues
            })

            let zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0]

            for (let i = 0; i < values.length; i++)
                for (let j = 0; j < values[i].length; j++)
                    if (values[i][j] !== undefined && values[i][j] != 0)
                        zeros[j] += parseFloat(values[i][j])

            const countPass = zeros[5]
            const countFail = zeros[6]

            //const FPY = `${parseFloat(((countPass) / (countPass + countFail)) * 100).toPrecision(5)}%`
            const FPY = `${((countPass * 100) / (countPass + countFail)).toPrecision(5)}%`

            zeros[4] = FPY

            const keysRow = document.createElement('tr')
            keys.forEach(key => {
                let keyHeader = document.createElement('th')

                keyHeader.innerHTML = key

                keysRow.appendChild(keyHeader)
            })

            const valuesRow = document.createElement('tr')
            zeros.forEach(value => {
                let valueCell = document.createElement('td')

                if (value === parseInt(value))
                    valueCell.innerHTML = parseInt(value)
                else if (value === parseFloat(value))
                    valueCell.innerHTML = value.toFixed(2)
                else if (typeof(value) === 'string')
                    valueCell.innerHTML = value

                valuesRow.appendChild(valueCell)
            })

            thead.appendChild(keysRow)
            tbody.appendChild(valuesRow)

            table.appendChild(thead)
            table.appendChild(tbody)

        }
        else {
            table.innerHTML = ''
            thead.innerHTML = ''
            tbody.innerHTML = ''
        }
    })

    array.length = 0
}
