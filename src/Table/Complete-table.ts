import CustomStorage from "../Storage/Local-Storage.js";

const Storage = new CustomStorage();

const fullTableSection: HTMLDivElement | null = document.querySelector('#full-table-section');

export default function CompleteTable() {
      fullTableSection.style.display = 'block';

      let arr: object[] = [...Storage.items.data];
      const remove = arr.shift();

      const leftArrow: HTMLButtonElement | null = document.querySelector('#left-arrow');
      const rightArrow: HTMLButtonElement | null = document.querySelector('#right-arrow');
      const fullTable: HTMLTableElement | null = document.querySelector('#full-table');
      const arrows: HTMLDivElement | null = document.querySelector('#index-arrows');
      const fullTableButton: HTMLButtonElement | null = document.querySelector('#full-table-button');
      const rowLimiter: HTMLInputElement | null = document.querySelector('#row-limiter');

      fullTableButton.addEventListener('click', () => {
            document.querySelector<HTMLButtonElement>('#submit-button').disabled = true;
            document.querySelector<HTMLButtonElement>('#reset').disabled = true;
            document.querySelector<HTMLButtonElement>('#full-table-button').disabled = true;
            document.querySelector<HTMLInputElement>('#summary-row-toggler-input').disabled = true;
            document.querySelector<HTMLElement>('#mode-label').setAttribute('style', 'opacity: 0;');
            document.querySelector<HTMLElement>('#shown-rows-counter-div').setAttribute('style', 'opacity: 0;');
            document.querySelector<HTMLElement>('#save-div').setAttribute('style', 'opacity: 0;');
            document.querySelector<HTMLElement>('#countpass-counter-div').setAttribute('style', 'opacity: 0;');

            const dataTable: HTMLTableElement | null = document.querySelector('#data-table');
            const clickToggler: HTMLSelectElement | null = document.querySelector('#click-toggler');
            const saveButton: HTMLButtonElement | null = document.querySelector('#save');
            const tableReload: HTMLButtonElement | null = document.querySelector('#reload-table');

            dataTable.innerHTML = '';
            fullTable.innerHTML = '';
            clickToggler.style.display = 'none';
            saveButton.style.display = 'none';
            tableReload.disabled = false;

            fullTableSection.style.opacity = '1';
            fullTableSection.style.transition = '0.2s';
            arrows.style.opacity = '1';
            arrows.style.transition = '0.2s';

            let index: number = 0;
            const allKeys: string[] = Object.keys(arr[0]);
            const separatedKeys: string[][] = [];

            while (allKeys.length > 0) {
                  separatedKeys.push(allKeys.splice(0, 10));
            }

            const renderTable = (index: number, keys: string[][]) => {
                  const thead = document.createElement('thead');
                  const tbody = document.createElement('tbody');

                  const headerRow = document.createElement('tr');

                  keys[index].forEach((key: string) => {
                        const headerCell: HTMLTableCellElement = document.createElement('th');
                        headerCell.innerHTML = key;

                        headerCell.style.minHeight = '30px';
                        headerCell.style.minWidth = '30px';

                        headerRow.appendChild(headerCell);
                  })
                  thead.appendChild(headerRow);

                  let outputLimiter: number;

                  if (rowLimiter?.value !== '') {
                        Storage.items.data.length > +rowLimiter?.value
                              ? outputLimiter = +rowLimiter?.value
                              : outputLimiter = Storage.items.data.length;
                  }
                  else
                        outputLimiter = Storage.items.data.length;

                  for (let i = 0; i < outputLimiter; i++) {
                        const dataRow: HTMLTableRowElement = document.createElement('tr');

                        keys[index].forEach((key: string) => {
                              const dataRowCell: HTMLTableCellElement = document.createElement('td');

                              if (key === 'FPY')
                                    dataRowCell.innerHTML = `${Storage.items.data[i][key]}%`;
                              else
                                    dataRowCell.innerHTML = Storage.items.data[i][key];

                              dataRowCell.style.minHeight = '30px';
                              dataRowCell.style.minWidth = '30px';

                              dataRow.appendChild(dataRowCell);
                        })

                        tbody.appendChild(dataRow);
                  }

                  fullTable.appendChild(tbody);
                  fullTable.appendChild(thead);
            }

            renderTable(index as number, separatedKeys as string[][]);

            leftArrow.addEventListener('click', () => {
                  fullTable.innerHTML = '';

                  if (index === 0)
                        index = index;
                  else
                        index -= 1;

                  renderTable(index, separatedKeys);
            })

            leftArrow.removeEventListener('click', () => { })

            rightArrow.addEventListener('click', () => {
                  fullTable.innerHTML = '';

                  if (index === separatedKeys.length - 1)
                        index = index;
                  else
                        index += 1;

                  renderTable(index, separatedKeys);
            })

            rightArrow.removeEventListener('click', () => { });
      })

      fullTableButton.removeEventListener('click', () => { });
}
