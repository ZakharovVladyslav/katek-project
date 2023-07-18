import { DISPLAY } from "../utils/enums";
import { ISetDisplay, SetDisplay } from "../utils/styleAttributes";

const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;
const overTables = document.querySelector('#over-tables') as HTMLDivElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
const staticTable = document.querySelector('#static-table') as HTMLTableElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

const Display: ISetDisplay = new SetDisplay();

export default function handleFullTableCheckboxChange() {
    if (fullNStaticTableSection.getAttribute('style') === DISPLAY.NONE) {
        if (dataTable.getAttribute('style') !== DISPLAY.NONE) {
            overTables.style.display = 'none';
            dataTable.style.display = 'none';
            scrollToTheBottom.style.opacity = '0';

            dataTable.innerHTML = '';
        }

        fullNStaticTableSection.style.display = 'flex';

        scrollToTheBottom.style.opacity = '1';

        submitBtn.click();
    } else {
        fullNStaticTableSection.style.display = 'none';

        fullTable.innerHTML = '';
        staticTable.innerHTML = '';

        scrollToTheBottom.style.opacity = '0';

        Display.setDisplayNone(document.querySelector('#show-more-results-btn') as HTMLButtonElement);
    }
}
