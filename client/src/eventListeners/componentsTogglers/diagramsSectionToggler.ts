import { ISetDisplay, SetDisplay } from "../../services/Display/setDisplayClass";
import { DISPLAY } from "../../utils/enums";

const Display: ISetDisplay = new SetDisplay();

const diagramsSection = document.querySelector('#diagrams-section') as HTMLDivElement;
const contentButtonsSection = document.querySelector('#content-buttons') as HTMLDivElement;
const tablesSection = document.querySelector('#tables-section') as HTMLDivElement;

export const appearDisappearDiagramsSection = () => {
    if (contentButtonsSection.getBoundingClientRect().height !== 0) {
        contentButtonsSection.setAttribute('style', DISPLAY.NONE);

        diagramsSection.setAttribute('style', DISPLAY.FLEX);
    } else {
        contentButtonsSection.setAttribute('style', DISPLAY.FLEX);

        diagramsSection.setAttribute('style', DISPLAY.NONE);
    }
}

export const appearDisappearTablesSection = () => {
    if (tablesSection.getBoundingClientRect().height !== 0) {
        Display.setDisplayFLEX(contentButtonsSection);
        Display.setDisplayNONE(tablesSection);
    } else {
        Display.setDisplayFLEX(tablesSection);
        Display.setDisplayNONE(contentButtonsSection);
    }
}

export const returnBackFromDiagramsSection = () => {
    diagramsSection.setAttribute('style', DISPLAY.NONE);

    contentButtonsSection.setAttribute('style', DISPLAY.FLEX);
}

export const returnBackFromTablesSection = () => {
    Display.setDisplayNONE(tablesSection);

    Display.setDisplayFLEX(contentButtonsSection);
}
