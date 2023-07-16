const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;
const overTables = document.querySelector('#over-tables') as HTMLDivElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const DISPLAY_NONE = 'display: none;';

export default function handleFullTableCheckboxChange() {
    if (fullNStaticTableSection.getAttribute('style') === DISPLAY_NONE) {
        if (dataTable.getAttribute('style') !== DISPLAY_NONE) {
            overTables.style.display = 'none';
            dataTable.style.display = 'none';
        }

        fullNStaticTableSection.style.display = 'flex';

        submitBtn.click();
    } else {
        fullNStaticTableSection.style.display = 'none';
        fullTable.innerHTML = '';
    }

    /*
    if (fullTableCheckbox.checked) {
        tableCheckbox.checked = false;
        dataTable.style.display = 'none';
        dataTable.innerHTML = '';
        overTables.style.display = 'none';

        fullTableSection.style.display = 'flex';

        submitBtn.click();
    } else {
        fullTableSection.style.display = 'none';
        fullTable.innerHTML = '';
    }
    */
}
