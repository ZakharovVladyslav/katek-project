'use strict'

import { dropDown, getKeyByItsValue } from "./funcs.js"

const inputForm = document.getElementById('input-form')
const file = document.getElementById('file-choose')
const dataTable = document.getElementById('data-table')
const emptyMessage = document.getElementById('empty-message')
const rowLimiter = document.getElementById('row-limiter')
const chosenFile = document.getElementById('chosen-file')
const reloadTable = document.getElementById('reload-table')
const cellSelect = document.getElementById('click-toggler')

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

const prodCodeList = document.getElementById('prodCodeList')
const customerList = document.getElementById('customerList')
const prodNameList = document.getElementById('prodNameList')
const articleNumList = document.getElementById('articleNumList')
const matNumList = document.getElementById('matNumList')
const hostNameList = document.getElementById('hostNameList')
const wkStNameList = document.getElementById('wkStNameList')
const adpNumList = document.getElementById('adpNumList')
const procNameList = document.getElementById('procNameList')
const avoList = document.getElementById('avoList')

function csvToArray(str, delimiter = ',') {
   const headers = str.slice(0, str.indexOf("\n")).split(delimiter)
   const rows = str.slice(str.indexOf("\n") + 1).split("\n")

   headers.pop()

   const arr = rows.map((row) => {
      const values = row.split(delimiter)
      const element = headers.reduce((object, header, index) => {
         object[header] = values[index]
         return object
      }, {})
      return element
   })

   return [arr, headers]
}

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

function getFilters(inputData, headers) {
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

file.oninput = (e) => {
   e.preventDefault()

   const arrFromFileName = file.value.replaceAll('\\', ',').split(',')

   chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1]
}

inputForm.addEventListener("submit", (e) => {
   e.preventDefault()

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
            const clickOption = cellSelect.options[cellSelect.selectedIndex].value

            if (emptyMessage.value != 0)
               emptyMessage.innerHTML = ''

            const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO"]
            const headerLists = [prodCodeList, customerList, prodNameList, hostNameList, matNumList, articleNumList, wkStNameList, adpNumList, procNameList, avoList]

            const data = [...csvToArray(text)[0]]

            const initialArray = getFilters(data, headers)
            data.length = 0

            const headerListLength = headers.length;
            for (let i = 0; i < headerListLength; i++)
               dropDown(initialArray, headers[i], headerLists[i])

            if (initialArray.length === 0) {
               emptyMessage.innerHTML = "Bitte fügen Sie Filter hinzu"

               document.body.append(emptyMessage)
            }

            reset.addEventListener('click', (e) => {
               e.preventDefault()

               prodCode.value = ''
               procName.value = ''
               prodName.value = ''
               customer.value = ''
               hostName.value = ''
               matNum.value = ''
               articleNum.value = ''
               wkstname.value = ''
               adpNum.value = ''
               avo.value = ''
               rowLimiter.value = 0
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
            for (let i = 0; i < 10; i++) {
               let theader = document.createElement('th')

               theader.innerHTML = initialArray[0][i]
               hrow.appendChild(theader)
            }
            thead.appendChild(hrow)

            for (let i = 1; i < initialArray.length; i++) {
               let body_row = document.createElement('tr')

               headers.forEach((header, j) => {
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

            table.addEventListener('click', e => {
               if (clickOption === "Add to filter") {
                  const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO"]
                  const data = [...csvToArray(text)[0]]
                  const initialArray = getFilters(data, headers)
                  data.length = 0

                  const targetId = e.target.id
                  const splittedTargetId = targetId.split('')
                  splittedTargetId.splice(0, 5)

                  const columnKeys = {
                     "1": "ProdCode",
                     "2": "Customer", 
                     "3": "ProdName",
                     "4": "HostName",
                     "5": "MatNum",
                     "6": "ArticleNum",
                     "7": "WkStName",
                     "8": "AdpNum",
                     "9": "ProcName",
                     "10": "AVO"
                  }

                  const column = +splittedTargetId[1] + 1
                  const targetValue = document.getElementById(targetId).innerHTML
                  const key = columnKeys[column.toString()]
                  const targetInput = document.getElementById(key)

                  targetInput.value = targetValue
               }
               else if (clickOption === "Show row") {
                  reloadTable.disabled = false
                  
                  const headers = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO"]
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
            headers.length = 0
         }
      }
      reader.readAsText(input)
   }
})
