Date.prototype.datePlus = (date) => {
      return date = date.getDays() + 1
}

export const countDateRange = (firstDate, secondDate) => {
      const dateFirst = new Date(firstDate)
      const dateSecond = new Date(secondDate)

      const oneDay = 24 * 60 * 60 * 1000; 

      return Math.round(Math.abs((dateFirst - dateSecond) / oneDay));
}