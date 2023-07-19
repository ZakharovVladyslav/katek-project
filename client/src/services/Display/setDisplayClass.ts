type THTMLElement =
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLDivElement
    | HTMLTableElement
    | HTMLTableSectionElement
    | HTMLTableCellElement
    | HTMLLabelElement
    | HTMLParagraphElement
    | HTMLFormElement;

export interface ISetDisplay {
    setDisplayFLEX: (htmlElement: THTMLElement | null) => void;
    setDisplayNONE: (htmlElement: THTMLElement | null) => void;
    setDisplayTABLE: (htmlElement: THTMLElement | null) => void;
    setDisplayBLOCK: (htmlElement: THTMLElement | null) => void;
    setDisplayINLINEBLOCK: (htmlElement: THTMLElement | null) => void;
    setDisplayGRID: (htmlElement: THTMLElement | null) => void;
    setOpacityPos: (htmlElement: THTMLElement | null) => void;
    setOpacityNeg: (htmlElement: THTMLElement | null) => void;
    checkElementsDisplayProperty: (htmlElement: THTMLElement | null) => string | undefined;
}

export class SetDisplay implements ISetDisplay {
    constructor() { }

    setDisplayFLEX = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'flex';
    };

    setDisplayNONE = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'none';
    };

    setDisplayTABLE = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'table';
    };

    setDisplayBLOCK = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'block';
    };

    setDisplayINLINEBLOCK = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'inline-block';
    };

    setDisplayGRID = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.display = 'grid';
    };

    setOpacityPos = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.opacity = '1';
    };

    setOpacityNeg = (htmlElement: THTMLElement | null) => {
        if (htmlElement)
            htmlElement.style.opacity = '0';
    }

    checkElementsDisplayProperty = (htmlElement: THTMLElement | null): string | undefined => {
        if (htmlElement) {
            const computedStyle = window.getComputedStyle(htmlElement);
            return computedStyle.getPropertyValue('display') as string;
        }
    };
}
