import { DISPLAY } from "../utils/enums";

const diagramsSection = document.querySelector('#diagrams-section') as HTMLDivElement;
const contentButtonsSection = document.querySelector('#content-buttons') as HTMLDivElement;

export const appearDisappearDiagramsSection = () => {
    if (contentButtonsSection.getBoundingClientRect().height !== 0) {
        contentButtonsSection.setAttribute('style', DISPLAY.NONE);

        diagramsSection.setAttribute('style', DISPLAY.FLEX);
    } else {
        contentButtonsSection.setAttribute('style', DISPLAY.FLEX);

        diagramsSection.setAttribute('style', DISPLAY.NONE);
    }
}

export const returnBackFromDiagramsSection = () => {
    diagramsSection.setAttribute('style', DISPLAY.NONE);

    contentButtonsSection.setAttribute('style', DISPLAY.FLEX);
}
