'use strict';

const table = document.querySelector('#data-table') as HTMLTableElement;

const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const fullTableSection = document.querySelector('#full-table-section') as HTMLDivElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const DISPLAY_NONE = 'display: none;'

export default function handleTableCheckboxChange() {

    console.log(table.getAttribute('style'));

    if (table.getAttribute('style') === DISPLAY_NONE) {
        if (fullTableSection.getAttribute('style') !== DISPLAY_NONE)
            fullTableSection.style.display = 'none';

        overTables.style.display = 'flex';
        table.style.display = 'table';

        submitBtn.click();
    } else {
        overTables.style.display = 'none';
        table.style.display = 'none';
        table.innerHTML = '';
    }

    /*
    if (!tableCheckbox.checked) {
        fullTableCheckbox.checked = false;
        fullTableSection.style.display = 'none';
        fullTable.innerHTML = '';

        overTables.style.display = 'flex';
        table.style.display = 'table';

        // Get the Y position of the #data-table element
        //const tableYPosition = getElementYPosition(table);

        // Scroll to the Y position of the #data-table element
        //scrollToYPosition(tableYPosition);

        submitBtn.click();
    } else {
        overTables.style.display = 'none';
        table.style.display = 'none';
    }
    */
}

// Get the Y position of an HTML element
export function getElementYPosition(element: HTMLElement): number {
    let yPosition = 0;

    while (element) {
        yPosition += element.offsetTop;
        element = element.offsetParent as HTMLElement;
    }

    return yPosition;
}

// Scroll the site to a specific Y position
export function scrollToYPosition(yPosition: number) {
    window.scrollTo({
        top: yPosition - 180,
        behavior: 'smooth'
    });
}
