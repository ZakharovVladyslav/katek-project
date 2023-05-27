import CustomStorage from "../Storage/Local-Storage.js"

const Storage = new CustomStorage();

export default function SummaryTable() {
    ;
    const toggleCheckboxInput: HTMLInputElement | null = document.querySelector('#summary-row-toggler-input');
    const table: HTMLTableElement | null = document.querySelector('#summary-table');
    const thead: HTMLTableSectionElement = document.createElement('thead');
    const tbody: HTMLTableSectionElement = document.createElement('tbody');

    toggleCheckboxInput?.addEventListener('change', e => {
        let array: object[] = [...Storage.items.data];

        if (!toggleCheckboxInput.checked) {
            table.style.maxWidth = '100px';
            table.innerHTML = '';
            thead.innerHTML = '';
            tbody.innerHTML = '';

            const keys: string[] = ['tLatenz', 'tLatenzSumme', 'tCycle', 'tProc', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

            const values: string[][] = array.map((object: object) => {
                const objectValues: string[] = [];

                keys.forEach((key: string) => {
                    objectValues.push(object[key]);
                })

                return objectValues;
            })

            let zeros: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (let i = 0; i < values.length; i++)
                for (let j = 0; j < values[i].length; j++)
                    if (values[i][j] !== undefined && values[i][j] != '0')
                        zeros[j] += parseFloat(values[i][j]);

            const countPass: number = zeros[5];
            const countFail: number = zeros[6];

            const FPY: string = `${((countPass * 100) / (countPass + countFail)).toPrecision(5)}%`;

            zeros[4] = FPY;

            const keysRow: HTMLTableRowElement = document.createElement('tr');
            keys.forEach((key: string) => {
                let keyHeader: HTMLTableCellElement = document.createElement('th');

                keyHeader.innerHTML = key;

                keysRow.appendChild(keyHeader);
            })

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
            })

            thead.appendChild(keysRow);
            tbody.appendChild(valuesRow);

            table.appendChild(thead);
            table.appendChild(tbody);

        }
        else {
            table.innerHTML = '';
            thead.innerHTML = '';
            tbody.innerHTML = '';
            table.style.maxWidth = '0';
        }

        array = null;
    })
    toggleCheckboxInput?.removeEventListener('change', e => { });
}
