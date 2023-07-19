import { ISetDisplay, SetDisplay } from "../../services/Display/setDisplayClass";
import CustomStorage, { ICustomStorage } from "../../services/Storage/CustomStorage";

const dateTableLeftArrow = document.querySelector('#date-table-left-arrow') as HTMLButtonElement;
const dateTableRightArrow = document.querySelector('#date-table-right-arrow') as HTMLButtonElement;

const innerDateRangeInputSection = document.querySelector('#inner-date-range-input-section') as HTMLDivElement;

const Display: ISetDisplay = new SetDisplay();
const Storage: ICustomStorage = new CustomStorage();

export default function dateTableToggler() {
    if (Display.checkElementsDisplayProperty(dateTableLeftArrow) === 'none' && Display.checkElementsDisplayProperty(dateTableRightArrow) === 'none') {
        Display.setDisplayBLOCK(dateTableLeftArrow);
        Display.setDisplayBLOCK(dateTableRightArrow);

        Display.setDisplayFLEX(innerDateRangeInputSection);

        Storage.setItem('dateTableIndex', 1);

        const activeTable = dateTableLeftArrow.closest('table');
        const activeTableCoords = dateTableLeftArrow.closest('table')?.getBoundingClientRect();

        console.log(activeTable);
        console.log(activeTableCoords);

        dateTableLeftArrow.setAttribute('style', 'opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute;');
        dateTableRightArrow.setAttribute('style', 'opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute;');

        dateTableLeftArrow.style.top = '900px';
        dateTableRightArrow.style.top = '900px';

        Display.setOpacityPos(dateTableLeftArrow);
        Display.setOpacityPos(dateTableRightArrow);
    } else {
        Display.setDisplayNONE(innerDateRangeInputSection);

        Display.setDisplayNONE(dateTableLeftArrow);
        Display.setDisplayNONE(dateTableRightArrow);

        Display.setOpacityNeg(dateTableLeftArrow);
        Display.setOpacityNeg(dateTableRightArrow);
    }


}
