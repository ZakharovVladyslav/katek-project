import CustomStorage, { ICustomStorage } from '../../services/Storage/CustomStorage.js';

const Storage: ICustomStorage = new CustomStorage();

const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const rowLimiter = document.querySelector('#row-limiter') as HTMLInputElement;

export const renderTable = (index: number, keys: string[][]) => {
	fullTable.innerHTML = '';

	const thead: HTMLTableSectionElement = document.createElement('thead');
	const tbody: HTMLTableSectionElement = document.createElement('tbody');

	const headerRow = document.createElement('tr');

	keys[index].forEach((key: string, i: number) => {
		const headerCell: HTMLTableCellElement = document.createElement('th');

		if (index === 0 && i === 0)
			headerCell.innerHTML = 'LogID';
		else
			headerCell.innerHTML = key;

		headerCell.style.minHeight = '30px';
		headerCell.style.minWidth = '30px';

		headerRow.appendChild(headerCell);
	});
	thead.appendChild(headerRow);

	if (rowLimiter && rowLimiter?.value !== '' && Storage.items.data) {
		Storage.items.data.length > +rowLimiter?.value
			? Storage.setItem('outputLimiter', +rowLimiter?.value)
			: Storage.setItem('outputLimiter', Storage.items.data.length);
	}
	else
		Storage.setItem('outputLimiter', Storage.items.data?.length);

	for (let i = 0; i < Storage.items.outputLimiter!; i++) {
		const dataRow: HTMLTableRowElement = document.createElement('tr');

		keys[index].forEach((key: string) => {
			const dataRowCell: HTMLTableCellElement = document.createElement('td');

			if (key === 'FPY')
				dataRowCell.innerHTML = `${Storage.items.data![i][key]}%`;
			else
				dataRowCell.innerHTML = `${Storage.items.data![i][key]}`;

			dataRowCell.style.minHeight = '30px';
			dataRowCell.style.minWidth = '30px';

			dataRow.appendChild(dataRowCell);
		});

		tbody.appendChild(dataRow);
	}

	fullTable?.appendChild(thead);
	fullTable?.appendChild(tbody);
};
