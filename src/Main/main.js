'use strict'

import dropDown from '../Functions/funcs.js'
import csvToArray from '../Functions/csvConvert.js'
import getFilters from '../Functions/mainFiltering.js'
import datePlusMinus from '../Functions/datePlusMinus.js'
import summaryRowToggle from '../Functions/summaryRow.js'

const inputForm = document.getElementById('input-form')
const file = document.getElementById('file-choose')
const dataTable = document.getElementById('data-table')
const emptyMessage = document.getElementById('empty-message')
const rowLimiter = document.getElementById('row-limiter')
const chosenFile = document.getElementById('chosen-file')
const reloadTable = document.getElementById('reload-table')
const cellSelect = document.getElementById('click-toggler')
const mode = document.getElementById('mode')

document.getElementById('left-date-inp').value = '2022-05-01'
document.getElementById('right-date-inp').value = '2022-05-03'

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
            mode.innerHTML = `Mode: ${clickOption}`

            cellSelect.onchange = () => {
               clickOption = cellSelect.options[cellSelect.selectedIndex].value
               mode.innerHTML = `Mode: ${clickOption}`
            }

            table.addEventListener('click', e => {
               const clickOption = cellSelect.options[cellSelect.selectedIndex].value

               mode.innerHTML = `Mode: ${clickOption}`  

               if (clickOption === "Add to filter" || clickOption === 'Zum Filtern hinzufugen') {
                  const data = csvToArray(text)[0]
                  const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']
                  data.length = 0

                  const targetId = e.target.id
                  const splittedTargetId = targetId.split('')
                  splittedTargetId.splice(0, 5)

                  const headersKeys = new Map()
                  headers.forEach((header, index) => {
                     headersKeys.set((index + 1).toString(), header)
                  })

                  const column = +splittedTargetId[1] + 1
                  
                  const targetValue = document.getElementById(targetId).innerHTML
                  
                  const key = headersKeys.get(column.toString())
                  const targetInput = document.getElementById(`input-${key}`)

                  targetInput.value = targetValue
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