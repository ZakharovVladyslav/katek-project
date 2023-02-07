export default function tableHeadersSelection(headers, results) {

    const table = document.querySelector('#table-selection')
    const tbody = document.createElement('tbody')
    const showResButton = document.querySelector('#showRes')
    const filtersForm = document.querySelector('#filters')

    const divideArrByNine = (arr) => {
        const resultArr = []

        for (let i = 0; i < 9; i++) {
            const innerArr = []
            for (let j = 0; j < 3; j++) {
                innerArr.push(arr[i * 3 + j])
            }
            resultArr.push(innerArr)
        }

        return resultArr
    }

    if (table.innerHTML === '') {
        for (let i = 0; i < 9; i++) {
            const tr = document.createElement('tr')
            for (let j = 0; j < 3; j++) {
                const td = document.createElement('td')
                let pos = divideArrByNine(headers)[i][j]
                td.innerHTML = divideArrByNine(headers)[i][j]

                td.addEventListener('click', () => {
                    results.indexOf(pos) === -1 ? results.push(pos) : results = results.filter(it => it !== pos)
                    td.classList.toggle('selected')
                });

                td.classList.add(`sqr-${td.innerHTML}`)
                td.id = `sqr-${td.innerHTML}`

                showResButton.onclick = () => {
                    const divs = document.querySelectorAll('#filter-div')
                    divs.forEach(div => div.remove())

                    results.forEach(filter => {
                        const html = `
                                        <div id='filter-div'>
                                            <label id='label-${filter}'><button type="button">&times</button>${filter}</label>
                                            <input id="input-${filter}"/>
                                        </div>
                                    `
                        filtersForm.insertAdjacentHTML('beforeend', html)
                    })
                }

                filtersForm.addEventListener('click', e => {

                    const target = e.target

                    if (target.tagName != 'BUTTON')
                        return

                    target.closest('section').removeChild(target.closest('#filter-div'))

                    const nelem = ['×', ' ', '\n']
                    const targetInnerText = e.target.closest('#filter-div')
                        .textContent
                        .split('')
                        .filter(elem => !nelem.includes(elem))
                        .join('')

                    const targetElementClassName = document.querySelector(`.sqr-${targetInnerText}`)

                    results.splice(results.indexOf(targetElementClassName.innerHTML), 1)

                    targetElementClassName.classList.remove('selected')
                })

                filtersForm.addEventListener('submit', e => {
                    e.preventDefault()
                })

                tr.appendChild(td)
            }
            tbody.appendChild(tr)
        }

        table.appendChild(tbody)
    }

    if (table.innerHTML !== '') {
        showResButton.onclick = () => {

            const divs = document.querySelectorAll('#filter-div')
            divs.forEach(div => div.remove())

            results.forEach(filter => {
                const html = `
                                <div id='filter-div'>
                                    <label id='label-${filter}'><button type="button">&times</button>${filter}</label>
                                    <input id="input-${filter}"/>
                                </div>
                            `
                filtersForm.insertAdjacentHTML('beforeend', html)
            })
        }
    }

    filtersForm.addEventListener('submit', e => {
        e.preventDefault()
    })

    filters.length = 0
}