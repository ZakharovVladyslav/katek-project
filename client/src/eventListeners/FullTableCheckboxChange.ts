const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;
const overTables = document.querySelector('#over-tables') as HTMLDivElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

const DISPLAY_NONE = 'display: none;';

export default function handleFullTableCheckboxChange() {
    if (fullNStaticTableSection.getAttribute('style') === DISPLAY_NONE) {
        if (dataTable.getAttribute('style') !== DISPLAY_NONE) {
            overTables.style.display = 'none';
            dataTable.style.display = 'none';
            scrollToTheBottom.style.opacity = '0';
        }

        fullNStaticTableSection.style.display = 'flex';

        scrollToTheBottom.style.opacity = '1';

        submitBtn.click();
    } else {
        fullNStaticTableSection.style.display = 'none';
        fullTable.innerHTML = '';
        scrollToTheBottom.style.opacity = '0';
    }
}
