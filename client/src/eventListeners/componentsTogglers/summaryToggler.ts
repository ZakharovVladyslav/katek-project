import { DISPLAY } from '../../utils/enums';

const summaryTable = document.querySelector('#summary-table') as HTMLTableElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

export default function handleSummaryRowShowHide() {
    if (summaryTable.getAttribute('style') === DISPLAY.NONE) {
        summaryTable.setAttribute('style', DISPLAY.TABLE);

        submitBtn.click();
    } else {
        summaryTable.setAttribute('style', DISPLAY.NONE);
    }
}
