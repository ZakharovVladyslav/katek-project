'use strict'

import tableHeadersSelection from "../Functions/headersSelection.js"
import datePlusMinus from '../Functions/datePlusMinus.js'

const form = document.getElementById('input-section')
const file = document.getElementById('file-choose')
const dataTable = document.getElementById('data-table')
const rowCounterInput = document.getElementById('row-counter-input')

const sideSection = document.getElementById('side-section')
const sideSectionToggleInput = document.getElementById('sidebar-input')
const sideSectionToggleLabel = document.getElementById('sidebar-input-label')

let results = []

// SideBar opening
sideSectionToggleInput.onchange = () => {
   if (sideSectionToggleInput.checked) {
      sideSection.style.width = '600px'
      sideSection.style.borderRight = '1px solid #00ffff'
      sideSectionToggleLabel.style.marginLeft = '600px'
      sideSectionToggleLabel.style.transform = 'rotate(360deg)'
      sideSectionToggleLabel.style.transition = '0.5s ease-in-out'
   } else {
      sideSection.style.width = '0px'
      
      setTimeout(() => sideSection.style.borderRight = '0px', 500)
      sideSectionToggleLabel.style.transform = 'rotate(-360deg)'
      sideSectionToggleLabel.style.marginLeft = '0px'
   }
}

function csvToArray(str, delimiter = ',') {
   const headers = str.slice(0, str.indexOf("\n")).split(delimiter)
   const rows = str.slice(str.indexOf("\n") + 1).split("\n")

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

function dateFilter(text) {
   const data = csvToArray(text)[0]

   const leftDate = document.getElementById('left-date-inp').value
   const rigthDate = document.getElementById('right-date-inp').value

   if (leftDate.length === 0 || rigthDate.length === 0) {

      return data
   }

   else {
      let newData = []

      const select = document.getElementById('select')
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

function summe(headers, data, keys, filters) {
   const filteredArray = data.map(object => {
      const innerArray = []

      headers.forEach(header => {
         innerArray.push(object[header])
      })

      return innerArray
   })

   const zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0]

   for (let i = 0; i < filteredArray.length; i++)
      for (let j = 0; j < filteredArray[i].length; j++)
         if (filteredArray[i][j] !== undefined && filteredArray[i][j] != 0)
            zeros[j] += parseFloat(filteredArray[i][j])

   const summaries = {
      set Sums(value) {
         [
            this.tLatenz, this.tLatenzSumme, this.tCycle,
            this.tProc, this.FPY, this.CountPass,
            this.CountFail, this.CountPass_Retest, this.CountFail_Retest
         ] = value
      },

      get Sums() {
         return [
            this.tLatenz, this.tLatenzSumme, this.tCycle,
            this.tProc, this.FPY, this.CountPass,
            this.CountFail, this.CountPass_Retest, this.CountFail_Retest
         ]
      }
   }

   summaries.Sums = zeros

   const fpy = ((summaries.CountPass - summaries.CountPass_Retest) / (summaries.CountPass + summaries.CountFail)) * 100

   zeros[4] = `${fpy.toFixed(2)}%`
   
   summaries.Sums = zeros

   filters.forEach(filter => {
      keys.forEach(key => {
         if (filter.id.slice(6) === key)
            zeros.unshift(filter.value)
      })
   })

   return zeros
}

function filteringArray(headers, text) {
   const data = dateFilter(text)

   const selectedNodesList = document.querySelectorAll('.selected')

   let selectedNodesListNames = []
   let filters = []

   if (selectedNodesList.length !== 0) {
       selectedNodesList.forEach(node => {
           selectedNodesListNames.push(node.classList[0].slice(4))
           filters.push(document.querySelector(`#input-${node.classList[0].slice(4)}`))
       })
   }

   const keys = filters.map(filter => {
      if (filter.value.length !== 0)
         return filter.id.slice(6)
   }).filter(elem => elem !== undefined)

   const values = filters.map(filter => {
      if (filter.value.length != 0)
         return filter.value
   }).filter(filter => filter !== undefined)

   const filteredArray = data.filter(e => {
      return keys.every(a => {
         return values.includes(e[a])
      })
   })

   if (filteredArray.length != +rowCounterInput.value)
      rowCounterInput.value = `${filteredArray.length}`

   return [keys, summe(headers, filteredArray, keys, filters), data]
}

form.addEventListener("submit", (e) => {
   e.preventDefault()

   datePlusMinus()

   console.log(document.querySelector('#filters').offsetWidth)
   console.log(document.querySelector('#filters').offsetHeight)

   const table = document.createElement('table')
   const thead = document.createElement('thead')
   const tbody = document.createElement('tbody')

   const input = file.files[0]
   const reader = new FileReader()

   reader.onload = (e) => {
      const text = e.target.result

      if (text.length === 0) {
         if (file.DOCUMENT_NODE > 0) {
            dataTable.innerHTML = ''
            table.innerHTML = ''
            thead.innerHTML = ''
            tbody.innerHTML = ''
         }
      }

      else {
         tableHeadersSelection(csvToArray(text)[1], results)

         dataTable.innerHTML = ''
         table.innerHTML = ''
         thead.innerHTML = ''
         tbody.innerHTML = ''

         const headers = ['tLatenz', 'tLatenzSumme', 'tCycle', 'tProc', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest']
         const [keys, filteredArray] = filteringArray(headers, text)

         keys.forEach(key => headers.unshift(key))

         let hrow = document.createElement('tr')
         let headersLength = headers.length
         for (let i = 0; i < headersLength; i++) {
            let theader = document.createElement('th')

            theader.innerHTML = headers[i]
            hrow.appendChild(theader)
         }
         thead.appendChild(hrow)

         let body_row = document.createElement('tr')
         let filteredArrayLength = filteredArray.length
         for (let i = 0; i < filteredArrayLength; i++) {
            const table_data = document.createElement('td')

            if (filteredArray[i] === parseInt(filteredArray[i]))
               table_data.innerHTML = parseInt(filteredArray[i])
            else if (filteredArray[i] === parseFloat(filteredArray[i]))
               table_data.innerHTML = filteredArray[i].toFixed(2)
            else
               table_data.innerHTML = `${filteredArray[i]}`

            body_row.appendChild(table_data)
         }
         tbody.appendChild(body_row)

         table.appendChild(thead)
         table.appendChild(tbody)
         dataTable.appendChild(table)

         filteredArray.length = 0
      }
   }
   reader.readAsText(input)
}
)
