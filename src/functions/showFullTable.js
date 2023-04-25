import Controller from "./Controller.js"

export const showFullTable = (inputArray) => {
      let arr = [...Controller.instance.core.changableArray]
      const remove = arr.shift()

      const leftArrow = document.querySelector('#left-arrow')
      const rightArrow = document.querySelector('#right-arrow')
      const fullTable = document.querySelector('#full-table')
      const arrows = document.querySelector('#index-arrows')
      const fullTableSection = document.querySelector('#full-table-section')
      const fullTableButton = document.querySelector('#full-table-button')

      fullTableButton.addEventListener('click', () => {
            document.querySelector('#submit-button').disabled = true
            document.querySelector('#reset').disabled = true
            document.querySelector('#full-table-button').disabled = true
            document.querySelector('#summary-row-toggler-input').disabled = true
            document.querySelector('#mode-label').style.opacity = '0'
            document.querySelector('#shown-rows-counter-div').style.opacity = '0'
            document.querySelector('#save-div').style.opacity = '0'

            const dataTable = document.querySelector('#data-table')
            const clickToggler = document.querySelector('#click-toggler')
            const saveButton = document.querySelector('#save')
            const tableReload = document.querySelector('#reload-table')

            dataTable.innerHTML = ''
            fullTable.innerHTML = ''
            clickToggler.style.display = 'none'
            saveButton.style.display = 'none'
            tableReload.disabled = false

            fullTableSection.style.opacity = '1'
            fullTableSection.style.transition = '0.2s'
            arrows.style.opacity = '1'
            arrows.style.transition = '0.2s'

            let index = 0
            const allKeys = Object.keys(arr[0])
            const separatedKeys = []

            while (allKeys.length > 0) {
                  separatedKeys.push(allKeys.splice(0, 10))
            }

            const renderTable = (index, keys) => {
                  const thead = document.createElement('thead')
                  const tbody = document.createElement('tbody')

                  const headerRow = document.createElement('tr')

                  keys[index].forEach(key => {
                        const headerCell = document.createElement('th')
                        headerCell.innerHTML = key

                        headerCell.style.minHeight = '30px'
                        headerCell.style.minWidth = '30px'

                        headerRow.appendChild(headerCell)
                  })
                  thead.appendChild(headerRow)

                  arr.forEach(obj => {

                        const dataRow = document.createElement('tr')

                        keys[index].forEach(key => {
                              const dataRowCell = document.createElement('td')

                              if (key === 'FPY')
                                    dataRowCell.innerHTML = `${obj[key]}%`
                              else
                                    dataRowCell.innerHTML = obj[key]

                              dataRowCell.style.minHeight = '30px'
                              dataRowCell.style.minWidth = '30px'

                              dataRow.appendChild(dataRowCell)
                        })

                        tbody.appendChild(dataRow)
                  })

                  fullTable.appendChild(tbody)
                  fullTable.appendChild(thead)
            }

            renderTable(index, separatedKeys)

            leftArrow.addEventListener('click', () => {
                  fullTable.innerHTML = ''

                  if (index === 0)
                        index = index
                  else
                        index -= 1

                  renderTable(index, separatedKeys)
            })

            rightArrow.addEventListener('click', () => {
                  fullTable.innerHTML = ''

                  if (index === separatedKeys.length - 1)
                        index = index
                  else
                        index += 1

                  renderTable(index, separatedKeys)
            })
      })
}
