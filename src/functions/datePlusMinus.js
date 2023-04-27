export default function datePlusMinus() {
    const leftDateInput = document.querySelector('#left-date-inp');
    const leftDateButtonMinus = document.querySelector('#left-date-minus');
    const leftDateMinusInput = document.querySelector('#left-date-minus-input');
    const leftDateButtonPlus = document.querySelector('#left-date-plus');
    const leftDatePlusInput = document.querySelector('#left-date-plus-input');

    const rightDateInput = document.querySelector('#right-date-inp');
    const rightDateButtonMinus = document.querySelector('#right-date-minus');
    const rightDateMinusInput = document.querySelector('#right-date-minus-input');
    const rightDateButtonPlus = document.querySelector('#right-date-plus');
    const rightDatePlusInput = document.querySelector('#right-date-plus-input');

    Date.prototype.addDays = (date, days) => {
        date.setDate(date.getDate() + days);

        return date;
    }

    Date.prototype.subtractDays = (date, days) => {
        date.setDate(date.getDate() - days);

        return date;
    }

    const convertFullDateToDate = (date) => {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (month < 10)
            month = `0${month}`;

        if (day < 10)
            day = `0${day}`;

        return `${year}-${month}-${day}`;
    }

    leftDateButtonMinus.disabled = false;
    leftDateButtonPlus.disabled = false;
    rightDateButtonMinus.disabled = false;
    rightDateButtonPlus.disabled = false;

    leftDateMinusInput.disabled = false;
    leftDatePlusInput.disabled = false;
    rightDateMinusInput.disabled = false;
    rightDatePlusInput.disabled = false;

    let leftDate, rightDate;

    let leftDateMinusDays = +leftDateMinusInput.value;
    let leftDatePlusDays = +leftDatePlusInput.value;
    let rightDateMinusDays = +rightDateMinusInput.value;
    let rightDatePlusDays = +rightDatePlusInput.value;

    leftDateMinusInput.addEventListener('change', () => {
        leftDateMinusDays = +leftDateMinusInput.value;
    })
    leftDateMinusInput.removeEventListener('change', () => {});

    leftDatePlusInput.addEventListener('change', () => {
        leftDatePlusDays = +leftDatePlusInput.value;
    })
    leftDatePlusInput.removeEventListener('change', () => {});

    rightDateMinusInput.addEventListener('change', () => {
        rightDateMinusDays = +rightDateMinusInput.value;
    })
    rightDateMinusInput.removeEventListener('change', () => {});

    rightDatePlusInput.addEventListener('change', () => {
        rightDatePlusDays = +rightDatePlusInput.value;
    })
    rightDatePlusInput.removeEventListener('change', () => {});

    if (leftDateInput.value !== '' || rightDateInput.value !== '') {

        if (leftDateInput.value !== '') {
            leftDate = new Date(leftDateInput.value);
        }

        if (rightDateInput.value !== '') {
            rightDate = new Date(rightDateInput.value);
        }

        leftDateButtonMinus.addEventListener('click', () => {
            leftDate.subtractDays(leftDate, leftDateMinusDays);
            console.log('left-minus');
            leftDateInput.value = convertFullDateToDate(leftDate);
        });
        leftDateButtonMinus.removeEventListener('click', () => {});

        leftDateButtonPlus.addEventListener('click', () => {
            leftDate.addDays(leftDate, leftDatePlusDays);
            console.log('left-plus');
            leftDateInput.value = convertFullDateToDate(leftDate);
        });
        leftDateButtonPlus.removeEventListener('click', () => {});

        rightDateButtonMinus.addEventListener('click', () => {
            rightDate.subtractDays(rightDate, rightDateMinusDays);
            console.log('right-minus');
            rightDateInput.value = convertFullDateToDate(rightDate);
        });
        rightDateButtonMinus.removeEventListener('click', () => {});

        rightDateButtonPlus.addEventListener('click', () => {
            rightDate.addDays(rightDate, rightDatePlusDays);
            console.log('right-plus');
            rightDateInput.value = convertFullDateToDate(rightDate);
        });
        rightDateButtonPlus.removeEventListener('click', () => {});
    }
}
