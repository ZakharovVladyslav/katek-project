'use strict'

import dropDown from '../Functions/funcs.js'
import csvToArray from '../Functions/csvConvert.js'
import getFilters from '../Functions/mainFiltering.js'
import datePlusMinus from '../Functions/datePlusMinus.js'
import summaryRowToggle from '../Functions/summaryRow.js'

const inputForm = document.querySelector('#input-form')
const file = document.querySelector('#file-choose')
const dataTable = document.querySelector('#data-table')
const emptyMessage = document.querySelector('#empty-message')
const rowLimiter = document.querySelector('#row-limiter')
const chosenFile = document.querySelector('#chosen-file')
const reloadTable = document.querySelector('#reload-table')
const cellSelect = document.querySelector('#click-toggler')
const filters = document.querySelector('#filters')
const clickToggler = document.querySelector('#click-toggler')

document.getElementById('left-date-inp').value = '2022-05-01'
document.getElementById('right-date-inp').value = '2022-05-03'

clickToggler.style.display = 'none'

let results = []

file.oninput = (e) => {
   e.preventDefault()

   const arrFromFileName = file.value.replaceAll('\\', ',').split(',')

   chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1]
}

inputForm.addEventListener("submit", (e) => {
   e.preventDefault()

   datePlusMinus()

   reloadTable.disabled = true

   const input = file.files[0]

   let table = document.createElement("table")
   let thead = document.createElement("thead")
   let tbody = document.createElement("tbody")
   const reader = new FileReader()

   if (file.value == '') {
      emptyMessage.innerHTML = "Datei nicht ausgewählt"

      dataTable.innerHTML = ''
   }
   else {
      const arrFromFileName = file.value.replaceAll('\\', ',').split(',')

      reader.onload = function (e) {
         const text = e.target.result

         if (text.length === 0) {
            if (file.DOCUMENT_NODE > 0) {
               dataTable.innerHTML = ''
               table.innerHTML = ''
               thead.innerHTML = ''
               tbody.innerHTML = ''
            }

            emptyMessage.innerHTML = `Datei <span>${arrFromFileName[arrFromFileName.length - 1]}</span> ist leer`
         }

         else {
            if (emptyMessage.value != 0)
               emptyMessage.innerHTML = ''

            clickToggler.style.display = 'block'

            filters.addEventListener('click', e => {
               const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))

               if (e.target.id.substring(0, 6) === 'eraser') {
                  const targetId = e.target.id.slice(7)
                  const targetInputField = filters[targetId - 1]
                  
                  targetInputField.value = ''
               }
            })

            const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']
            const arrayFromCsv = csvToArray(text)
            const data = arrayFromCsv[0]
            const initialArray = getFilters(data, tableHeaders)
            data.length = 0

            summaryRowToggle(initialArray)

            if (initialArray.length === 0) {
               emptyMessage.innerHTML = "Bitte fügen Sie Filter hinzu"

               document.body.append(emptyMessage)
            }

            reset.addEventListener('click', (e) => {
               e.preventDefault()

               rowLimiter.value = 0

               const inputs = document.querySelectorAll('.selected')

               inputs.forEach(input => {
                  const targetInput = document.querySelector(`#input-${input.classList[0].slice(4)}`)

                  targetInput.value = ''
               })
            })

            dataTable.innerHTML = ''
            table.innerHTML = ''
            thead.innerHTML = ''
            tbody.innerHTML = ''

            const innerTable = document.createElement('table')
            innerTable.innerHTML = ''

            table.appendChild(thead)
            table.appendChild(tbody)
            table.setAttribute('id', 'tb')

            document.getElementById('data-table').appendChild(table)

            if (initialArray.length != +rowLimiter.value)
               rowLimiter.value = `${initialArray.length - 1}`

            let hrow = document.createElement('tr')
            for (let i = 0; i < 16; i++) {
               let theader = document.createElement('th')

               theader.innerHTML = initialArray[0][i]
               hrow.appendChild(theader)
            }
            thead.appendChild(hrow)

            for (let i = 1; i < initialArray.length; i++) {
               let body_row = document.createElement('tr')

               tableHeaders.forEach((header, j) => {
                  let table_data = document.createElement('td')

                  table_data.setAttribute('id', `cell ${i}${j}`)
                  table_data.innerHTML = initialArray[i][header]

                  body_row.appendChild(table_data)
               })
               tbody.appendChild(body_row)
            }

            table.appendChild(thead)
            table.appendChild(tbody)
            dataTable.appendChild(table)

            let clickOption = cellSelect.options[cellSelect.selectedIndex].value

            cellSelect.onchange = () => {
               clickOption = cellSelect.options[cellSelect.selectedIndex].value
            }

            table.addEventListener('click', e => {
               const clickOption = cellSelect.options[cellSelect.selectedIndex].value

               if (clickOption === "Add to filter" || clickOption === 'Zum Filtern hinzufugen') {
                  const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))
                  const targetCellValue = e.target.innerHTML
                  
                  let index = filters.length - (filters.map(filter => {
                     if (filter.value === '')
                        return filter
                  }).filter(filter => filter !== undefined).length)

                  const targetInputField = filters[index]
                  if (index > -1 && index < 5)
                     targetInputField.value = targetCellValue
               }

               else if (clickOption === "Show row" || clickOption == 'Reihe zeigen') {
                  reloadTable.disabled = false

                  const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']
                  const data = [...csvToArray(text)[0]]
                  const initialArray = getFilters(data, headers)
                  data.length = 0

                  const targetId = e.target.id
                  const splittedTargetId = targetId.split('')
                  splittedTargetId.splice(0, 5)

                  const row = splittedTargetId[0]

                  const object = initialArray[row]

                  dataTable.innerHTML = ''
                  table.innerHTML = ''
                  thead.innerHTML = ''
                  tbody.innerHTML = ''

                  const rowTable = document.createElement('table')
                  rowTable.setAttribute('id', 'rowTable')

                  const allHeaders = []
                  const allValues = []

                  for (let [key, value] of Object.entries(object)) {
                     allHeaders.push(key)
                     allValues.push(value)
                  }

                  const divideArrByNine = (arr) => {
                     const resultArr = []

                     for (let i = 0; i < 3; i++) {
                        const innerArr = []
                        for (let j = 0; j < 9; j++) {
                           innerArr.push(arr[i * 9 + j])
                        }
                        resultArr.push(innerArr)
                     }

                     return resultArr
                  }

                  const resArr = []
                  for (let i = 0; i < 3; i++)
                     resArr.push(divideArrByNine(allHeaders)[i], divideArrByNine(allValues)[i])

                  for (let i = 0; i < 6; i++) {
                     const tr = document.createElement('tr')
                     for (let j = 0; j < 9; j++) {
                        const td = document.createElement('td')
                        td.innerHTML = resArr[i][j]
                        tr.appendChild(td)
                     }
                     tbody.appendChild(tr)
                  }

                  rowTable.append(tbody)
                  dataTable.append(rowTable)

                  initialArray.length = 0
                  object.length = 0
                  splittedTargetId.length = 0
               }

            })

            data.length = 0
            initialArray.length = 0
            tableHeaders.length = 0
         }
      }
      reader.readAsText(input)
   }
})