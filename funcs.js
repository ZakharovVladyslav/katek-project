'use strict'

export function dropDown(data, header, listName) {
    const options = document.querySelectorAll(`#${header}-option`)
    options.forEach(opt => opt.remove())

    const dataByKey = data.map(object => {
        for (let key of Object.keys(object))
            if (key === header)
                return object[key]
    }).filter(element => {
        if (element !== undefined && element !== '' && element !== ' ')
            return element
    })

    const setDataByKey = Array.from(new Set(dataByKey))

    for (let i = 0; i < setDataByKey.length; i++) {
        const option = document.createElement('option')
        option.setAttribute('id', `${header}-option`)

        option.value = setDataByKey[i]
        listName.appendChild(option)
    }

}

export function getKeyByItsValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}