export default function csvToArray(str, delimiter = ',') {

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