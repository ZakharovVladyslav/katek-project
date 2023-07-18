'use strict';

import { DISPLAY } from "../utils/enums";
import { ISetDisplay, SetDisplay } from "../utils/styleAttributes";

const table = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
const staticTable = document.querySelector('#static-table') as HTMLTableElement;

const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLDivElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;
const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

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
    } else {
        overTables.style.display = 'none';
        table.style.display = 'none';

        table.innerHTML = '';

        scrollToTheBottom.style.opacity = '0';

        Display.setDisplayNone(document.querySelector('#show-more-results-btn') as HTMLButtonElement);
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
