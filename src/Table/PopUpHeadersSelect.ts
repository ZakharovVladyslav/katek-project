import CustomStorage from '../Storage/Local-Storage.js';

const Storage = new CustomStorage();

const callPopupBtn: HTMLButtonElement | null = document.querySelector('#call-popup');
const selectHeadersDiv: HTMLDivElement | null = document.querySelector('#select-headers-div');
const headersTable: HTMLTableElement | null = document.querySelector('#select-headers-table');
const tableWrapper: HTMLDivElement | null = document.querySelector('#table-wrapper');

let eventListenerAdded = false; // Variable to track if the event listener has been added

export default function PopUpHeadersSelect() {
	if (Storage.items.saveOption === 'Headers' || Storage.items.saveOption === 'Headers & Filters') {
		selectHeadersDiv?.setAttribute('style', 'opacity: 1');
		callPopupBtn?.setAttribute('disabled', 'false');
		headersTable?.setAttribute('innerHTML', '');

		const headersTableBody: HTMLTableSectionElement | null = document.createElement('tbody');

		const allHeaders: string[]  = [...Storage.items.allHeaders];
		const headers: string[][] = [];
		let selectedHeaders: string[] = [...Storage.items.selectedHeaders];

		while (allHeaders.length > 0)
			headers.push(allHeaders.splice(0, 5));

		headers.forEach((row: string[], rowIndex: number) => {
			const tableRow: HTMLTableRowElement = document.createElement('tr');

			row.forEach((header: string, cellIndex: number) => {
				const tableCell: HTMLTableCellElement = document.createElement('td');
				tableCell.innerHTML = header;

				const pos: string = headers[rowIndex][cellIndex];

				tableCell.classList.add('sqr');
				tableCell.id = 'sqr';

				if (Storage.items.selectedHeaders.includes(header))
					tableCell.classList.toggle('selected');

				tableCell.addEventListener('click', () => {
					selectedHeaders.indexOf(pos) === -1 ? selectedHeaders.push(pos) : selectedHeaders = selectedHeaders.filter(elem => elem !== pos);
					tableCell.classList.toggle('selected');
					Storage.setItem('selectedHeaders', selectedHeaders);
				});

				tableRow.appendChild(tableCell);
			});

			headersTableBody.appendChild(tableRow);
		});

		headersTable?.appendChild(headersTableBody);

		if (!eventListenerAdded) {
			const handleCallPopupBtnClick = () => {
				tableWrapper?.classList.toggle('show');
			};
			eventListenerAdded = true;
			callPopupBtn?.addEventListener('click', handleCallPopupBtnClick);
			callPopupBtn?.removeEventListener('click', handleCallPopupBtnClick);
		}
	} else {
		document.querySelector<HTMLDivElement>('#select-headers-div')?.setAttribute('style', 'opacity: 0;');
		document.querySelector<HTMLButtonElement>('#call-popup')?.setAttribute('disabled', 'true');
	}
}
