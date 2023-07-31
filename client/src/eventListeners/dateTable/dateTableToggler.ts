import { ISetDisplay, SetDisplay } from "../../services/Display/setDisplayClass";
import CustomStorage, { ICustomStorage } from "../../services/Storage/CustomStorage";

const dateTableLeftArrow = document.querySelector('#date-table-left-arrow') as HTMLButtonElement;
const dateTableRightArrow = document.querySelector('#date-table-right-arrow') as HTMLButtonElement;
const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const innerDateRangeInputSection = document.querySelector('#inner-date-range-input-section') as HTMLDivElement;

const leftInnerDatePicker = document.querySelector('#left-inner-date-picker') as HTMLInputElement;
const rightInnerDatePicker = document.querySelector('#right-inner-date-picker') as HTMLInputElement;

const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const countTable = document.querySelector('#countPF-table') as HTMLTableElement;

const Display: ISetDisplay = new SetDisplay();
const Storage: ICustomStorage = new CustomStorage();

export default function dateTableToggler() {
    if (Display.checkElementsDisplayProperty(dateTableLeftArrow) === 'none' && Display.checkElementsDisplayProperty(dateTableRightArrow) === 'none') {
        if (Display.checkElementsDisplayProperty(fullNStaticTableSection) !== 'none') {
            Display.setDisplayNONE(fullNStaticTableSection);
        }

        Display.setDisplayBLOCK(dateTableRightArrow);

        Display.setDisplayFLEX(innerDateRangeInputSection);
        Display.setDisplayBLOCK(leftInnerDatePicker);
        Display.setDisplayBLOCK(rightInnerDatePicker);

        Display.setDisplayTABLE(dataTable);
        Display.setDisplayTABLE(countTable);

        submitBtn.click()

        Storage.setItem('dateTableIndex', 1);

        // const activeTable = dateTableLeftArrow.closest('table');
        // const activeTableCoords = dateTableLeftArrow.closest('table')?.getBoundingClientRect();

        dateTableLeftArrow.setAttribute('style', 'opacity: 1; transition: 0.2s; align-self: flex-start; position: absolute;');
        dateTableRightArrow.setAttribute('style', 'opacity: 1; transition: 0.2s; align-self: flex-start; position: absolute;');

        Display.setOpacityPos(dateTableRightArrow);

        Display.setDisplayNONE(dateTableLeftArrow);
    } else {
        Display.setDisplayNONE(innerDateRangeInputSection);

        Display.setDisplayNONE(dateTableLeftArrow);
        Display.setDisplayNONE(dateTableRightArrow);

        Display.setOpacityNeg(dateTableLeftArrow);
        Display.setOpacityNeg(dateTableRightArrow);
    }


}
