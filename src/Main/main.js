'use strict'

import { showFullTable } from '../Functions/showFullTable.js'
import csvToArray from '../Functions/csvConvert.js'
import getFilters from '../Functions/getFilters.js'
import datePlusMinus from '../Functions/datePlusMinus.js'
import summaryRowToggle from '../Functions/summaryRow.js'
import { getAllValues } from '../Functions/getAllValues.js'

const inputForm = document.querySelector('#input-form')
const file = document.querySelector('#file-choose')

const submitBtn = document.querySelector('#submit-button')
const resetBtn = document.querySelector('#reset')

const dataTable = document.querySelector('#data-table')

const emptyMessage = document.querySelector('#empty-message')

const rowLimiter = document.querySelector('#row-limiter')

const chosenFile = document.querySelector('#chosen-file')
const reloadTable = document.querySelector('#reload-table')
const cellSelect = document.querySelector('#click-toggler')

const filters = document.querySelector('#filters')

const clickToggler = document.querySelector('#click-toggler')
const saveButton = document.querySelector('#save')
const load = document.querySelector('#load')
const loadingMessage = document.querySelector('#loading-table')

const rowsAmount = document.querySelector('#rows-amount')

const fullTable = document.querySelector('#full-table')
const fullTableBtn = document.querySelector('#full-table-button')
const arrows = document.querySelector('#index-arrows')

const saveFiltersOption = document.querySelector('#save-filter-option')
const saveDiv = document.querySelector('#save-div')

const delimiterSelection = document.querySelector('#delimiter-selection')

const realRowsNumber = document.querySelector('#real-rows-number')
const shownRowsCounter = document.querySelector('#shown-rows-counter')
const shownRowsCounterDiv = document.querySelector('.shown-rows-counter-div')
const fullTableSection = document.querySelector('#full-table-section')

const summaryRowToggleInput = document.querySelector('#summary-row-toggler-input')
const modeLabel = document.querySelector('#mode-label')

fullTableSection.style.opacity = '0'
load.style.opacity = '0'
loadingMessage.style.opacity = '0'
saveDiv.style.opacity = '0'
realRowsNumber.style.opacity = '0'
shownRowsCounter.style.opacity = '0'
shownRowsCounterDiv.style.opacity = '0'
modeLabel.style.opacity = '0'
clickToggler.style.display = 'none'
saveButton.style.display = 'none'

submitBtn.disabled = true

/*
document.querySelector('#left-date-inp').value = '2022-05-02'
document.querySelector('#right-date-inp').value = '2022-05-03'
*/

file.oninput = (e) => {
   e.preventDefault()

   submitBtn.disabled = false

   const arrFromFileName = file.value.replaceAll('\\', ',').split(',')

   chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1]

   const fileReader = new FileReader()
   const inputFileData = file.files[0]

   fileReader.onload = (e) => {
      let text = e.target.result
      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

      reset.addEventListener('click', e => {
         e.preventDefault()

         const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value

         const data = csvToArray(text, delimiterOption)[0]
         const updatedArray = getFilters(data, tableHeaders)

         if (data.length > 8000)
            emptyMessage.innerHTML = 'Table is too big. Please add dates or filters'

         data.length = 0

         const filtersInput = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))
         filtersInput.push(document.querySelector('#left-date-inp'))
         filtersInput.push(document.querySelector('#right-date-inp'))

         filtersInput.forEach(filter => filter.value = '')

         updatedArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = updatedArray.length - 3

         const values = getAllValues(updatedArray, tableHeaders)

         const dataLists = [...Array(5)].map((_, index) => {
            return document.querySelector(`#datalist-${index + 1}`)
         })

         dataLists.forEach(datalist => {
            for (let option of datalist.children)
               option.value = ''

            values.forEach(value => {
               const option = document.createElement('option')
               option.className = 'datalist-option'
               option.value = value
               datalist.appendChild(option)
            })
         })
      })

      filters.addEventListener('click', e => {
         const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))

         const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
         const data = csvToArray(text, delimiterOption)[0]

         const updatedArray = getFilters(data, tableHeaders)
         data.length = 0

         if (e.target.id.substring(0, 6) === 'eraser') {
            const targetId = e.target.id.slice(7)
            const targetInputField = filters[targetId - 1]

            targetInputField.value = ''

            updatedArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = updatedArray.length - 3

            const values = getAllValues(updatedArray, tableHeaders)

            const dataLists = [...Array(5)].map((_, index) => {
               return document.querySelector(`#datalist-${index + 1}`)
            })

            dataLists.forEach(datalist => {
               for (let option of datalist.children)
                  option.value = ''

               values.forEach(value => {
                  const option = document.createElement('option')
                  option.className = 'datalist-option'
                  option.value = value
                  datalist.appendChild(option)
               })
            })
         }
      })
   }

   fileReader.readAsText(inputFileData)
}

file.onchange = () => {
   datePlusMinus()

   const fileReader = new FileReader()
   const inputFileData = file.files[0]

   fileReader.onload = (e) => {
      let text = e.target.result

      const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
      const data = csvToArray(text, delimiterOption)[0]

      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']
      const filteredArray = getFilters(data, tableHeaders)

      if (filteredArray.length > 8000) {
         dataTable.innerHTML = ''

         emptyMessage.innerHTML = 'Table is too big. Please add dates or filters'
      }

      const values = getAllValues(filteredArray, tableHeaders)

      const dataLists = [...Array(5)].map((_, index) => {
         return document.querySelector(`#datalist-${index + 1}`)
      })

      dataLists.forEach(datalist => {
         for (let option of datalist.children)
            option.value = ''

         values.forEach(value => {
            const option = document.createElement('option')
            option.className = 'datalist-option'
            option.value = value
            datalist.appendChild(option)
         })
      })

      rowsAmount.innerHTML = filteredArray.length - 3

      filters.onclick = (e) => {
         const targetId = e.target.id
         const targetNumber = targetId.slice(-1)

         const targetField = document.querySelector(`#filter-input-${targetNumber}`)

         targetField.onchange = () => {
            const arr = getFilters(data, tableHeaders)

            const values = getAllValues(arr, tableHeaders)

            const dataLists = [...Array(5)].map((_, index) => {
               return document.querySelector(`#datalist-${index + 1}`)
            })

            dataLists.forEach(datalist => {
               for (let option of datalist.children)
                  option.value = ''

               values.forEach(value => {
                  const option = document.createElement('option')
                  option.className = 'datalist-option'
                  option.value = value
                  datalist.appendChild(option)
               })
            })

            arr.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = arr.length - 1
         }
      }
   }

   fileReader.readAsText(inputFileData)
}

filters.addEventListener('click', e => {
   const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))

   if (e.target.id.substring(0, 6) === 'eraser') {
      const targetId = e.target.id.slice(7)
      const targetInputField = filters[targetId - 1]

      targetInputField.value = ''
   }
})

inputForm.addEventListener("submit", (e) => {
   e.preventDefault()

   resetBtn.disabled = false
   fullTableBtn.disabled = false
   summaryRowToggleInput.disabled = false

   if (submitBtn.disabled)
      submitBtn.disabled = false

   saveDiv.style.opacity = '0'
   realRowsNumber.style.opacity = '0'
   shownRowsCounter.style.opacity = '0'
   shownRowsCounterDiv.style.opacity = '0'
   modeLabel.style.opacity = '0'
   load.style.opacity = '1'
   loadingMessage.style.opacity = '1'
   load.style.transition = '0.2s'
   loadingMessage.style.transition = '0.2s'
   saveDiv.style.transition = '0.2s'

   fullTable.innerHTML = ''
   arrows.style.opacity = '0'
   emptyMessage.innerHTML = ''

   dataTable.innerHTML = ''
   clickToggler.style.display = 'none'
   saveButton.style.display = 'none'

   const input = file.files[0]

   const reader = new FileReader()

   reader.onload = e => {

      if (file.value == '') {
         emptyMessage.innerHTML = "Datei nicht ausgewählt"

         dataTable.innerHTML = ''
      }

      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

      var mainText = e.target.result

      const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
      const csvArray = csvToArray(mainText, delimiterOption)

      let data = csvArray[0]
      const initialArray = getFilters(data, tableHeaders)

      if (initialArray.length > 3000) {
         dataTable.innerHTML = ''

         emptyMessage.innerHTML = 'Table is too big. Please add dates or filters'
      }

      else {

         load.style.opacity = '1'
         loadingMessage.style.opacity = '1'
         load.style.transition = '0.2s'
         loadingMessage.style.transition = '0.2s'

         datePlusMinus()

         reloadTable.disabled = true

         let table = document.createElement("table")
         let thead = document.createElement("thead")
         let tbody = document.createElement("tbody")

         const arrFromFileName = file.value.replaceAll('\\', ',').split(',')

         var mainText = e.target.result

         if (mainText.length === 0) {
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

            load.style.transition = '0.2s'
            loadingMessage.style.transition = '0.2s'
            load.style.opacity = '1'
            loadingMessage.style.opacity = '1'
            realRowsNumber.style.opacity = '1'
            shownRowsCounter.style.opacity = '1'
            shownRowsCounterDiv.style.opacity = '1'
            modeLabel.style.opacity = '1'
            clickToggler.style.display = 'block'
            saveButton.style.display = 'block'

            filters.addEventListener('click', e => {
               const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))

               if (e.target.id.substring(0, 6) === 'eraser') {
                  const targetId = e.target.id.slice(7)
                  const targetInputField = filters[targetId - 1]

                  targetInputField.value = ''
               }
            })

            /*----------------------------------------------------------------------------------------------------------------*/
            /*----------------------------------------------------------------------------------------------------------------*/
            /*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
            /*----------------------------------------------------------------------------------------------------------------*/
            /*----------------------------------------------------------------------------------------------------------------*/

            reset.addEventListener('click', (e) => {
               e.preventDefault()

               const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

               const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value

               console.log(mainText)

               const csvArray = csvToArray(mainText, delimiterOption)

               let data = csvArray[0]

               const updatedArray = getFilters(data, tableHeaders)
               const poppedUpdatedArray = updatedArray.pop()

               if (data.length > 8000)
                  emptyMessage.innerHTML = 'Table is too big. Please add dates or filters'

               data.length = 0

               const filtersInput = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))
               filtersInput.push(document.querySelector('#left-date-inp'))
               filtersInput.push(document.querySelector('#right-date-inp'))

               filtersInput.forEach(filter => filter.value = '')

               updatedArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = updatedArray.length
               const values = getAllValues(updatedArray, tableHeaders)

               const dataLists = [...Array(5)].map((_, index) => {
                  return document.querySelector(`#datalist-${index + 1}`)
               })

               dataLists.forEach(datalist => {
                  for (let option of datalist.children)
                     option.value = ''

                  values.forEach(value => {
                     const option = document.createElement('option')
                     option.className = 'datalist-option'
                     option.value = value
                     datalist.appendChild(option)
                  })
               })
            })

            const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

            data = data.filter((obj, index) => {
               return !Object.values(obj).includes(undefined)
            })

            const initialArray = getFilters(data, tableHeaders)
            data.length = 0

            const filtersFromCsvFile = csvArray[2]

            const filtersFromCsvFileSplitted = filtersFromCsvFile.split(',').filter(elem => elem !== '')

            const inputFields = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))

            filtersFromCsvFileSplitted.forEach((value, index) => {
               inputFields[index].setAttribute('placeholder', value)
            })

            initialArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = initialArray.length - 1

            const dataLists = [...Array(5)].map((_, index) => {
               return document.querySelector(`#datalist-${index + 1}`)
            })

            const values = getAllValues(initialArray, tableHeaders)

            dataLists.forEach(datalist => {
               for (let option of datalist.children)
                  option.value = ''

               values.forEach(value => {
                  const option = document.createElement('option')
                  option.className = 'datalist-option'
                  option.value = value
                  datalist.appendChild(option)
               })
            })

            const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
            const dataForCsv = getFilters(data, csvToArray(mainText, delimiterOption)[1])

            saveButton.onclick = () => {
               const refinedData = []
               let filtersValues

               if (saveFiltersOption.checked === true) {
                  filtersValues = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`).value)
                  filtersValues = filtersValues.filter(value => value !== '')

                  dataForCsv[0].unshift('#')
                  if (filtersValues.length > 0)
                     dataForCsv[0].unshift(filtersValues)

                  dataForCsv[0] = dataForCsv[0].flat(Infinity)

               }

               dataForCsv.forEach(obj => {
                  refinedData.push(Object.values(obj))
               })

               let csvContent = ''
               refinedData.forEach(row => {
                  csvContent += row.join(',') + '\n'
               })

               const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
               const objUrl = URL.createObjectURL(blob)
               saveButton.setAttribute('href', objUrl)

               const dateNow = new Date()
               saveButton.setAttribute('download', `Filtered-table-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`)

            }

            data.length = 0

            summaryRowToggle(initialArray)

            if (initialArray.length === 0) {
               emptyMessage.innerHTML = "Bitte fügen Sie Filter hinzu"

               document.body.append(emptyMessage)
            }

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

            load.style.transition = '0s'
            loadingMessage.style.transition = '0s'
            load.style.opacity = '0'
            loadingMessage.style.opacity = '0'

            if (rowLimiter.value !== '') {
               if (initialArray.length > rowLimiter.length)
                  initialArray.length = rowLimiter.length
               else
                  rowLimiter.length = initialArray.length
            }

            shownRowsCounter.innerHTML = initialArray.length - 1

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

                  if (header === 'FPY')
                     table_data.innerHTML = `${initialArray[i][header]}%`
                  else
                     table_data.innerHTML = initialArray[i][header]

                  body_row.appendChild(table_data)
               })
               tbody.appendChild(body_row)
            }

            table.appendChild(thead)
            table.appendChild(tbody)
            dataTable.appendChild(table)

            saveDiv.style.opacity = '1'
            saveDiv.style.transition = '0.2s'

            showFullTable(initialArray)

            let clickOption = ''

            cellSelect.onchange = () => {
               clickOption = cellSelect.options[cellSelect.selectedIndex].value
            }

            table.addEventListener('click', e => {
               const clickOption = cellSelect.options[cellSelect.selectedIndex].value

               if (clickOption === "Add to filters" || clickOption === 'Zum Filtern hinzufügen') {
                  const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

                  const filters = [...Array(5)].map((_, index) => document.querySelector(`#filter-input-${index + 1}`))
                  const targetCellValue = e.target.innerHTML

                  const emptyFieldIndexes = filters.map((filter, index) => {
                     if (filter.value === '')
                        return index
                  }).filter(filter => filter !== undefined)

                  if (emptyFieldIndexes.length !== 0) {
                     const targetInputField = filters[emptyFieldIndexes[0]]
                     targetInputField.value = targetCellValue
                  }

                  const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
                  const data = csvToArray(mainText, delimiterOption)[0]

                  const updatedArray = getFilters(data, tableHeaders)
                  data.length = 0

                  updatedArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = updatedArray.length
               }

               else if (clickOption === "Show row" || clickOption == 'Zeile anzeigen') {
                  reloadTable.disabled = false

                  const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc']

                  const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value
                  const data = [...csvToArray(mainText, delimiterOption)[0]]

                  const initialArray = getFilters(data, headers)
                  data.length = 0

                  const targetId = e.target.id
                  const splittedTargetId = targetId.split('')
                  splittedTargetId.splice(0, 5)

                  const row = +splittedTargetId[0]

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
         mainText = ''
      }
      mainText = ''
   }

   reader.readAsText(input)
})
