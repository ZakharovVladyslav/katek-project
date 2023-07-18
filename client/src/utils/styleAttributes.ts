type THTMLElement =
| HTMLInputElement
| HTMLButtonElement
| HTMLDivElement
| HTMLTableElement
| HTMLTableSectionElement
| HTMLTableCellElement
| HTMLLabelElement
| HTMLParagraphElement
| HTMLFormElement

export interface ISetDisplay {
    setDisplayFlex: (htmlElement: THTMLElement) => void,
    setDisplayNone: (htmlElement: THTMLElement) => void,
    setDisplayTable: (htmlElement: THTMLElement) => void,
    setDisplayBlock: (htmlElement: THTMLElement) => void,
    setDisplayInlineBlock: (htmlElement: THTMLElement) => void,
    setDisplayGrid: (htmlElement: THTMLElement) => void
}

export class SetDisplay implements ISetDisplay {
    constructor() {}

    setDisplayFlex = (htmlElement: THTMLElement) => {
        htmlElement.style.display = 'flex';
    }

    setDisplayNone = (htmlElement: THTMLElement) => {
        htmlElement.style.display = 'none';
    }

    setDisplayTable = (htmlElement: THTMLElement) => {
        htmlElement.style.display = 'table';
    }

    setDisplayBlock = (htmlElement: THTMLElement) => {
        htmlElement.style.display = 'block';
    }

    setDisplayInlineBlock = (htmlElement: THTMLElement) => {
        htmlElement.style.display = 'inline-block';
    }

    setDisplayGrid = (HTMLElement: THTMLElement) => {
        HTMLElement.style.display = 'grid';
    }
}
