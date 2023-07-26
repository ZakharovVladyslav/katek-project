import { DISPLAY } from "../../utils/enums";
import { ISetDisplay, SetDisplay } from "../../services/Display/setDisplayClass";

const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;
const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const innerDateRangeInputSection = document.querySelector('#inner-date-range-input-section') as HTMLDivElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
const staticTable = document.querySelector('#static-table') as HTMLTableElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;
const dateTableRightArrow = document.querySelector('#date-table-right-arrow') as HTMLButtonElement;
const dateTableLeftArrow = document.querySelector('#date-table-left-arrow') as HTMLButtonElement;

const leftInnerDatePicker = document.querySelector('#left-inner-date-picker') as HTMLInputElement;
const rightInnerDatePicker = document.querySelector('#right-inner-date-picker') as HTMLInputElement;

const Display: ISetDisplay = new SetDisplay();

export default function handleFullTableCheckboxChange() {
    if (fullNStaticTableSection.getAttribute('style') === DISPLAY.NONE) {
        if (Display.checkElementsDisplayProperty(dateTableLeftArrow) !== 'none' || Display.checkElementsDisplayProperty(dateTableRightArrow) !== 'none') {
            Display.setDisplayNONE(dateTableLeftArrow);
            Display.setDisplayNONE(dateTableRightArrow);
        }

        if (Display.checkElementsDisplayProperty(leftInnerDatePicker) !== 'none' || Display.checkElementsDisplayProperty(rightInnerDatePicker) !== 'none') {
            Display.setDisplayNONE(leftInnerDatePicker);
            Display.setDisplayNONE(rightInnerDatePicker);
            Display.setDisplayNONE(innerDateRangeInputSection);
        }

        if (dataTable.getAttribute('style') !== DISPLAY.NONE) {
            overTables.style.display = 'none';
            dataTable.style.display = 'none';
            scrollToTheBottom.style.opacity = '0';

            dataTable.innerHTML = '';
        }

        fullNStaticTableSection.style.display = 'flex';

        scrollToTheBottom.style.opacity = '1';

        submitBtn.click();
    }
    else {
        fullNStaticTableSection.style.display = 'none';

        fullTable.innerHTML = '';
        staticTable.innerHTML = '';

        scrollToTheBottom.style.opacity = '0';

        Display.setDisplayNONE(document.querySelector('#show-more-results-btn') as HTMLButtonElement);
    }
}
