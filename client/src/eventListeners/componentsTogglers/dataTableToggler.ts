'use strict';

import { DISPLAY } from "../../utils/enums";
import { ISetDisplay, SetDisplay } from "../../services/Display/setDisplayClass";

const table = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
const staticTable = document.querySelector('#static-table') as HTMLTableElement;

const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;
const innerDateRangeInputSection = document.querySelector('#inner-date-range-input-section') as HTMLDivElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;
const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const dateTableRightArrow = document.querySelector('#date-table-right-arrow') as HTMLButtonElement;
const dateTableLeftArrow = document.querySelector('#date-table-left-arrow') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

const leftInnerDatePicker = document.querySelector('#left-inner-date-picker') as HTMLInputElement;
const rightInnerDatePicker = document.querySelector('#right-inner-date-picker') as HTMLInputElement;

const countTable = document.querySelector('#countPF-table') as HTMLTableElement;

const Display: ISetDisplay = new SetDisplay();

export default function handleTableCheckboxChange() {
    if (table.getAttribute('style') === DISPLAY.NONE) {
        if (fullNStaticTableSection.getAttribute('style') !== DISPLAY.NONE) {
            fullNStaticTableSection.style.display = 'none';
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'none';
            scrollToTheBottom.style.opacity = '0';

            fullTable.innerHTML = '';
            staticTable.innerHTML = '';
        }

        overTables.style.display = 'flex';
        table.style.display = 'table';

        scrollToTheBottom.style.opacity = '1';

        submitBtn.click();
    }
    else if (
        Display.checkElementsDisplayProperty(table) !== 'none' &&
        ( Display.checkElementsDisplayProperty(dateTableRightArrow) !== 'none' || Display.checkElementsDisplayProperty(dateTableLeftArrow) !== 'none')
    ) {
        if (Display.checkElementsDisplayProperty(dateTableLeftArrow) !== 'none' || Display.checkElementsDisplayProperty(dateTableRightArrow) !== 'none') {
            Display.setDisplayNONE(dateTableLeftArrow);
            Display.setDisplayNONE(dateTableRightArrow);
            Display.setDisplayNONE(countTable);
        }

        if (Display.checkElementsDisplayProperty(leftInnerDatePicker) !== 'none' || Display.checkElementsDisplayProperty(rightInnerDatePicker) !== 'none') {
            Display.setDisplayNONE(leftInnerDatePicker);
            Display.setDisplayNONE(rightInnerDatePicker);
            Display.setDisplayNONE(innerDateRangeInputSection);
        }

        submitBtn.click();
    }
    else {
        overTables.style.display = 'none';
        table.style.display = 'none';

        table.innerHTML = '';

        scrollToTheBottom.style.opacity = '0';

        Display.setDisplayNONE(document.querySelector('#show-more-results-btn') as HTMLButtonElement);
    }
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

export function getElementWidth(element: HTMLElement): number {
    return element.offsetWidth;
}

// Scroll the site to a specific Y position
export function scrollToYPosition(yPosition: number) {
    window.scrollTo({
        top: yPosition - 180,
        behavior: 'smooth'
    });
}
