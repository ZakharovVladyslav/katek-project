import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import { FullDataInterface } from '../utils/types.js';

const Storage: ICustomStorage = new CustomStorage();

const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const rowLimiter = document.querySelector('#row-limiter') as HTMLInputElement;

export const renderTable = (index: number, keys: string[][]) => {
	fullTable.innerHTML = '';

	const thead: HTMLTableSectionElement = document.createElement('thead');
	const tbody: HTMLTableSectionElement = document.createElement('tbody');

	const headerRow = document.createElement('tr');

	keys[index].forEach((key: string) => {
		const headerCell: HTMLTableCellElement = document.createElement('th');
		headerCell.innerHTML = key;

		headerCell.style.minHeight = '30px';
		headerCell.style.minWidth = '30px';

		headerRow.appendChild(headerCell);
	});
	thead.appendChild(headerRow);

	let outputLimiter: number | undefined;

	if (rowLimiter && rowLimiter?.value !== '' && Storage.items.data) {
		Storage.items.data.length > +rowLimiter?.value
			? outputLimiter = +rowLimiter?.value
			: outputLimiter = Storage.items.data?.length;
	}
	else
		outputLimiter = Storage.items.data?.length;

	for (let i = 0; i < outputLimiter!; i++) {
		const dataRow: HTMLTableRowElement = document.createElement('tr');

		keys[index].forEach((key: string) => {
			const dataRowCell: HTMLTableCellElement = document.createElement('td');

			if (key === 'FPY')
				dataRowCell.innerHTML = Storage.items.data ? `${Storage.items.data[i][key]}%` : '';
			else
				dataRowCell.innerHTML = Storage.items.data ? `${Storage.items.data[i][key as keyof FullDataInterface]}` : '';

			dataRowCell.style.minHeight = '30px';
			dataRowCell.style.minWidth = '30px';

			dataRow.appendChild(dataRowCell);
		});

		tbody.appendChild(dataRow);
	}

	fullTable?.appendChild(tbody);
	fullTable?.appendChild(thead);
};
