import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const toggleCheckboxInput: HTMLInputElement | null = document.querySelector('#content-input-summaryRow');
const table = document.querySelector('#summary-table') as HTMLTableElement;
const thead = document.createElement('thead') as HTMLTableSectionElement;
const tbody = document.createElement('tbody') as HTMLTableSectionElement;

const Storage: ICustomStorage = new CustomStorage();

export default function handleSummaryRowCheckboxChange() {
    let array: object[] | null = [...Storage.items.data ?? []];

    if (!toggleCheckboxInput?.checked) {

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

        for (let i = 0; i < values.length; i++)
            for (let j = 0; j < values[i].length; j++)
                if (values[i][j] !== undefined && values[i][j] != '0')
                    zeros[j] += parseFloat(values[i][j]);

        const countPass: number = zeros[5];
        const countFail: number = zeros[6];

        const FPY = `${((countPass * 100) / (countPass + countFail)).toPrecision(5)}%`;

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

    }
    else {
        table.innerHTML = '';

        table?.setAttribute('style', 'display: none;');
    }

    array = null;
};