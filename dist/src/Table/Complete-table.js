import CustomStorage from '../Storage/Local-Storage.js';
const Storage = new CustomStorage();
const fullTableSection = document.querySelector('#full-table-section');
export default function CompleteTable() {
    fullTableSection?.setAttribute('style', 'display: block;');
    const arr = [...Storage.items.data];
    const remove = arr.shift();
    const leftArrow = document.querySelector('#left-arrow');
    const rightArrow = document.querySelector('#right-arrow');
    const fullTable = document.querySelector('#full-table');
    const arrows = document.querySelector('#index-arrows');
    const fullTableButton = document.querySelector('#full-table-button');
    const rowLimiter = document.querySelector('#row-limiter');
    const handleFullTableButtonClick = () => {
        document.querySelector('#submit-button')?.setAttribute('disabled', 'true');
        document.querySelector('#reset')?.setAttribute('disabled', 'true');
        document.querySelector('#full-table-button')?.setAttribute('disabled', 'true');
        document.querySelector('#summary-row-toggler-input')?.setAttribute('disabled', 'true');
        document.querySelector('#mode-label')?.setAttribute('style', 'opacity: 0;');
        document.querySelector('#shown-rows-counter-div')?.setAttribute('style', 'opacity: 0;');
        document.querySelector('#save-div')?.setAttribute('style', 'opacity: 0;');
        document.querySelector('#countpass-counter-div')?.setAttribute('style', 'opacity: 0;');
        const dataTable = document.querySelector('#data-table');
        const clickToggler = document.querySelector('#click-toggler');
        const saveButton = document.querySelector('#save');
        const tableReload = document.querySelector('#reload-table');
        dataTable?.setAttribute('innerHTML', '');
        fullTable?.setAttribute('innerHTML', '');
        clickToggler?.setAttribute('style', 'display: none;');
        saveButton?.setAttribute('style', 'display: none;');
        tableReload?.setAttribute('disabled', 'false');
        fullTableSection?.setAttribute('style', 'opacity: 1; transition: 0.2s;');
        arrows?.setAttribute('style', 'opacity: 1; transition: 0.2s;');
        let index = 0;
        const allKeys = Object.keys(arr[0]);
        const separatedKeys = [];
        while (allKeys.length > 0) {
            separatedKeys.push(allKeys.splice(0, 10));
        }
        const renderTable = (index, keys) => {
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');
            const headerRow = document.createElement('tr');
            keys[index].forEach((key) => {
                const headerCell = document.createElement('th');
                headerCell.innerHTML = key;
                headerCell.style.minHeight = '30px';
                headerCell.style.minWidth = '30px';
                headerRow.appendChild(headerCell);
            });
            thead.appendChild(headerRow);
            let outputLimiter;
            if (rowLimiter && rowLimiter?.value !== '') {
                Storage.items.data.length > +rowLimiter?.value
                    ? outputLimiter = +rowLimiter?.value
                    : outputLimiter = Storage.items.data.length;
            }
            else
                outputLimiter = Storage.items.data.length;
            for (let i = 0; i < outputLimiter; i++) {
                const dataRow = document.createElement('tr');
                keys[index].forEach((key) => {
                    const dataRowCell = document.createElement('td');
                    if (key === 'FPY')
                        dataRowCell.innerHTML = `${Storage.items.data[i][key]}%`;
                    else
                        dataRowCell.innerHTML = Storage.items.data[i][key];
                    dataRowCell.style.minHeight = '30px';
                    dataRowCell.style.minWidth = '30px';
                    dataRow.appendChild(dataRowCell);
                });
                tbody.appendChild(dataRow);
            }
            fullTable?.appendChild(tbody);
            fullTable?.appendChild(thead);
        };
        renderTable(index, separatedKeys);
        const handleLeftArrowClick = () => {
            fullTable?.setAttribute('innerHTML', '');
            if (index === 0)
                // eslint-disable-next-line no-self-assign
                index = index;
            else
                index -= 1;
            renderTable(index, separatedKeys);
        };
        leftArrow?.addEventListener('click', handleLeftArrowClick);
        leftArrow?.removeEventListener('click', handleLeftArrowClick);
        const handleRightArrowClick = () => {
            fullTable?.setAttribute('innerHTML', '');
            if (index === separatedKeys.length - 1)
                // eslint-disable-next-line no-self-assign
                index = index;
            else
                index += 1;
            renderTable(index, separatedKeys);
        };
        rightArrow?.addEventListener('click', handleRightArrowClick);
        rightArrow?.removeEventListener('click', handleRightArrowClick);
    };
    fullTableButton?.addEventListener('click', handleFullTableButtonClick);
    fullTableButton?.removeEventListener('click', handleFullTableButtonClick);
}
