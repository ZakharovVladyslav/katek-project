import CustomStorage from '../services/Storage/Local-Storage.js';

const Storage = new CustomStorage();

const fullTableSection: HTMLDivElement | null = document.querySelector('#full-table-section');

export default function CompleteTable() {
	fullTableSection?.setAttribute('style', 'display: block;');

	const arr: object[] = [...Storage.items.data];
	const remove = arr.shift();

	const leftArrow: HTMLButtonElement | null = document.querySelector('#left-arrow');
	const rightArrow: HTMLButtonElement | null = document.querySelector('#right-arrow');
	const fullTable: HTMLTableElement | null = document.querySelector('#full-table');
	const arrows: HTMLDivElement | null = document.querySelector('#index-arrows');
	const fullTableButton: HTMLButtonElement | null = document.querySelector('#full-table-button');
	const rowLimiter: HTMLInputElement | null = document.querySelector('#row-limiter');

	const handleFullTableButtonClick = () => {
		const submitBtn: HTMLButtonElement | null = document.querySelector('#submit-button');
		const resetBtn: HTMLButtonElement | null = document.querySelector('#reset');
		const fullTableBtn: HTMLButtonElement | null = document.querySelector('#full-table-button');
		const summaryRowTogglerInput: HTMLInputElement | null = document.querySelector('#summary-row-toggler-input');

		if (submitBtn)
			submitBtn.disabled = true;
		if (resetBtn)
			resetBtn.disabled = true;
		if (fullTableBtn)
			fullTableBtn.disabled = true;
		if (summaryRowTogglerInput)
			summaryRowTogglerInput.disabled = true;

		document.querySelector<HTMLElement>('#mode-label')?.setAttribute('style', 'opacity: 0;');
		document.querySelector<HTMLElement>('#shown-rows-counter-div')?.setAttribute('style', 'opacity: 0;');
		document.querySelector<HTMLElement>('#save-div')?.setAttribute('style', 'opacity: 0;');
		document.querySelector<HTMLElement>('#countpass-counter-div')?.setAttribute('style', 'opacity: 0;');

		const dataTable: HTMLTableElement | null = document.querySelector('#data-table');
		const clickToggler: HTMLSelectElement | null = document.querySelector('#click-toggler');
		const saveButton: HTMLButtonElement | null = document.querySelector('#save');
		const tableReload: HTMLButtonElement | null = document.querySelector('#reload-table');

		if (dataTable)
			dataTable.innerHTML = '';
		if (fullTable)
			fullTable.innerHTML = '';

		clickToggler?.setAttribute('style', 'display: none;');
		saveButton?.setAttribute('style', 'display: none;');

		if (tableReload)
			tableReload.disabled = false;

		fullTableSection?.setAttribute('style', 'opacity: 1; transition: 0.2s;');
		arrows?.setAttribute('style','opacity: 1; transition: 0.2s;');

		let index = 0;
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
			});
			thead.appendChild(headerRow);

			let outputLimiter: number;

			if (rowLimiter && rowLimiter?.value !== '') {
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
				});

				tbody.appendChild(dataRow);
			}

			fullTable?.appendChild(tbody);
			fullTable?.appendChild(thead);
		};

		renderTable(index as number, separatedKeys as string[][]);

		const handleLeftArrowClick = () => {
			if (fullTable)
				fullTable.innerHTML = '';

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
			if (fullTable)
				fullTable.innerHTML = '';

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
