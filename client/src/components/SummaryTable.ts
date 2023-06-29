import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const table = document.querySelector('#summary-table') as HTMLTableElement;
const thead = document.createElement('thead') as HTMLTableSectionElement;
const tbody = document.createElement('tbody') as HTMLTableSectionElement;

const Storage: ICustomStorage = new CustomStorage();

export default function generateSummaryRow() {
    let array: object[] | null = [...Storage.items.data ?? []];

    table.innerHTML = '';
    tbody.innerHTML = '';
    thead.innerHTML = '';

    table?.setAttribute('style', 'display: table');

    const keys: string[] = ['tLatenz', 'tLatenzSumme', 'tCycle', 'tProc', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

    const values: string[][] = array.map((object: { [key: string]: any }) => {
        const objectValues: string[] = [];

        keys.forEach((key: string) => {
            objectValues.push(object[key]);
        });

        return objectValues;
    });

    const zeros: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    values.forEach(valuesArray => {
        valuesArray.forEach((value, index: number) => {
            if (value !== undefined && value != '0' && value !== null)
                zeros[index] += parseFloat(value);
        })
    })

    const countPass: number = zeros[5];
    const countFail: number = zeros[6];

    const FPY = `${((countPass * 100) / (countPass + countFail)).toPrecision(5)}%`;

    console.log(zeros);

    zeros[4] = FPY;

    const keysRow: HTMLTableRowElement = document.createElement('tr');
    keys.forEach((key: string) => {
        const keyHeader: HTMLTableCellElement = document.createElement('th');

        keyHeader.innerHTML = key;

        keysRow.appendChild(keyHeader);
    });

    const valuesRow: HTMLTableRowElement = document.createElement('tr');
    zeros.forEach((value: any) => {
        const valueCell: HTMLTableCellElement = document.createElement('td');

        if (typeof value === 'number' && Number.isInteger(value))
            valueCell.innerHTML = value.toString();
        else if (typeof value === 'number')
            valueCell.innerHTML = value.toFixed(2);
        else if (typeof value === 'string')
            valueCell.innerHTML = value;

        valuesRow.appendChild(valueCell);
    });

    thead?.appendChild(keysRow);
    tbody?.appendChild(valuesRow);

    table?.appendChild(thead);
    table?.appendChild(tbody);

    array = null;
};
