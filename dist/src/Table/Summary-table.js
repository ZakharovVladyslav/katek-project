import CustomStorage from '../Storage/Local-Storage.js';
const Storage = new CustomStorage();
export default function SummaryTable() {
    const toggleCheckboxInput = document.querySelector('#summary-row-toggler-input');
    const table = document.querySelector('#summary-table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const handleToggleCheckboxInputChange = () => {
        let array = [...Storage.items.data];
        if (!toggleCheckboxInput?.checked) {
            table?.setAttribute('style', 'max-widht: 100px;');
            table?.setAttribute('innerHTML', '');
            const keys = ['tLatenz', 'tLatenzSumme', 'tCycle', 'tProc', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];
            const values = array.map((object) => {
                const objectValues = [];
                keys.forEach((key) => {
                    objectValues.push(object[key]);
                });
                return objectValues;
            });
            const zeros = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < values.length; i++)
                for (let j = 0; j < values[i].length; j++)
                    if (values[i][j] !== undefined && values[i][j] != '0')
                        zeros[j] += parseFloat(values[i][j]);
            const countPass = zeros[5];
            const countFail = zeros[6];
            const FPY = `${((countPass * 100) / (countPass + countFail)).toPrecision(5)}%`;
            zeros[4] = FPY;
            const keysRow = document.createElement('tr');
            keys.forEach((key) => {
                const keyHeader = document.createElement('th');
                keyHeader.innerHTML = key;
                keysRow.appendChild(keyHeader);
            });
            const valuesRow = document.createElement('tr');
            zeros.forEach((value) => {
                const valueCell = document.createElement('td');
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
            table?.setAttribute('innerHTML', '');
            table?.setAttribute('style', 'max-width: 0;');
        }
        array = null;
    };
    toggleCheckboxInput?.addEventListener('change', handleToggleCheckboxInputChange);
    toggleCheckboxInput?.removeEventListener('change', handleToggleCheckboxInputChange);
}
