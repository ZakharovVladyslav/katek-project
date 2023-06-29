import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import { renderTable } from '../utils/renderFullTable.js';

const Storage: ICustomStorage = new CustomStorage();

const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;

const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const summaryRowTogglerInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;

export default function printFullTable() {
	leftArrow.style.display = 'block';
	rightArrow.style.display = 'block';

	let arr: object[] = [...Storage.items.data ?? []];

	summaryRowTogglerInput.disabled = true;
	leftArrow.disabled = true;

	let index = 0;

	const allKeys: string[] = Object.keys(arr[0]);
	const separatedKeys: string[][] = [];

	while (allKeys.length > 0) {
		separatedKeys.push(allKeys.splice(0, 10));
	}

	renderTable(index, separatedKeys);

	if (fullTable.innerHTML !== '') {
		if (index === 0)
			leftArrow?.setAttribute('style', `opacity: 0; transition: 0.2s; height: 40px; align-self: flex-start; position: static; left: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);

		rightArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: static; right: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
	} else {
		leftArrow.style.opacity = '0';
		rightArrow.style.opacity = '0';
	}

	const handleLeftArrowClick = () => {
		console.log(index);

		if (index === 0) {
			leftArrow?.setAttribute('style', `height: 0px; transition: 0.2s; opacity: 0; align-self: flex-start; left: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
			leftArrow.disabled = true;
		}
		else {
			index -= 1;
			rightArrow.disabled = false;

			index === 0
			? leftArrow?.setAttribute('style', `opacity: 0; transition: 0.2s; height: 40px; align-self: flex-start; left: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`)
			: leftArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; left: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`)

			renderTable(index, separatedKeys);
		}

		rightArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; right: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
	};

	leftArrow?.addEventListener('click', handleLeftArrowClick);

	const handleRightArrowClick = () => {
		if (index === separatedKeys.length - 1) {
			index = separatedKeys.length - 1;
			rightArrow?.setAttribute('style', `opacity: 0; transition: 0.2s; height: px; align-self: flex-start; right: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
			rightArrow.disabled = true;
		}
		else {
			index += 1;
			leftArrow.disabled = false;
			rightArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; right: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
		}

		renderTable(index, separatedKeys);

		leftArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; left: ${((1920 - fullTable.offsetWidth) / 2) - 120}px`);
	};
	rightArrow?.addEventListener('click', handleRightArrowClick);
};
