import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import { renderTable } from '../utils/renderFullTable.js';

const Storage: ICustomStorage = new CustomStorage();

const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;

const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const summaryRowTogglerInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;

export default function printFullTable() {
	let arr: object[] = [...Storage.items.data ?? []];

	summaryRowTogglerInput.disabled = true;

	let index = 0;

	const allKeys: string[] = Object.keys(arr[0]);
	const separatedKeys: string[][] = [];

	while (allKeys.length > 0) {
		separatedKeys.push(allKeys.splice(0, 10));
	}

	renderTable(index, separatedKeys);

	const tableHeight = fullTable?.offsetHeight;

	if (fullTable.innerHTML !== '') {
		if (index === 0)
			leftArrow?.setAttribute('style', `display: none; transition: 0.2s; height: 0px;`);

		rightArrow?.setAttribute('style', `display: block; transition: 0.2s; height: ${tableHeight}px;`);
	} else {
		leftArrow.style.display = 'none';
		rightArrow.style.display = 'none';
	}

	const handleLeftArrowClick = () => {

		const tableHeight = fullTable?.offsetHeight;

		console.log(index);

		if (index === 0) {
			leftArrow?.setAttribute('style', 'height: 0px; transition: 0.2s; display: none;');
		}
		else {
			index -= 1;

			index === 0
			? leftArrow?.setAttribute('style', 'height: 0px; transition: 0.2s; display: none;')
			: leftArrow?.setAttribute('style', `display: block; transition: 0.2s; height: ${tableHeight}px;`)

			renderTable(index, separatedKeys);
		}

		rightArrow?.setAttribute('style', `display: block; transition: 0.2s; height: ${tableHeight}px;`);
	};

	leftArrow?.addEventListener('click', handleLeftArrowClick);

	const handleRightArrowClick = () => {
		const tableHeight = fullTable?.offsetHeight;

		if (Storage.items.fullTablePageIndex === separatedKeys.length - 1)
			index = separatedKeys.length - 1;
		else {
			index += 1;
		}

		renderTable(index, separatedKeys);

		leftArrow?.setAttribute('style', `display: block; transition: 0.2s; height: ${tableHeight}px;`);
		rightArrow?.setAttribute('style', `display: block; transition: 0.2s; height: ${tableHeight}px;`);
	};
	rightArrow?.addEventListener('click', handleRightArrowClick);
};
