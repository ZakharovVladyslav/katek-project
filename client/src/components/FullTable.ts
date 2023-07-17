import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import { renderTable } from '../utils/renderComponents/renderFullTable.js';
import renderStaticTable from '../utils/renderComponents/renderStaticTable.js';

const Storage: ICustomStorage = new CustomStorage();

const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;

const fullTable = document.querySelector('#full-table') as HTMLTableElement;

const summaryRowTogglerInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;

export default function printFullTable() {
	let arr: object[] = [...Storage.items.data ?? []];

	leftArrow.style.display = 'block';
	rightArrow.style.display = 'block';

	const fullTableCoords = fullTable.getBoundingClientRect();
	const rightArrowCoords = rightArrow.getBoundingClientRect();
	const leftArrowCoords = leftArrow.getBoundingClientRect();

	summaryRowTogglerInput.disabled = true;
	leftArrow.disabled = true;

	let index = 0;

	let allKeys: string[] = [];

	Storage.items.fullTableHeaders ? allKeys = [...Storage.items.fullTableHeaders] : allKeys = Object.keys(arr[0]);

	const separatedKeys: string[][] = [];

	while (allKeys.length > 0) {
		separatedKeys.push(allKeys.splice(0, 7));
	}

	renderTable(index, separatedKeys);
	renderStaticTable();

	if (fullTableCoords.width !== 0) {
		if (index === 0)
			leftArrow?.setAttribute('style', `opacity: 0; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; left: ${fullTableCoords.left - leftArrowCoords.width - 10}px;`);

		rightArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; right: ${1920 - fullTableCoords.right - rightArrowCoords.width - 30}px;`);
	} else {
		leftArrow.style.opacity = '0';
		rightArrow.style.opacity = '0';
	}

	const handleLeftArrowClick = () => {
		const fullTableCoords = fullTable.getBoundingClientRect();
		const rightArrowCoords = rightArrow.getBoundingClientRect();
		const leftArrowCoords = leftArrow.getBoundingClientRect();

		Storage.items.fullTableHeaders ? allKeys = [...Storage.items.fullTableHeaders] : allKeys = Object.keys(arr[0]);

		if (index === 0) {
			leftArrow?.setAttribute('style', `height: 0px; transition: 0.2s; opacity: 0; align-self: flex-start; position: absolute; left: ${fullTableCoords.left - leftArrowCoords.width - 10}px;`);
			leftArrow.disabled = true;
		}
		else {
			index -= 1;
			rightArrow.disabled = false;

			index === 0
				? leftArrow?.setAttribute('style', `opacity: 0; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; left: ${fullTableCoords.left - leftArrowCoords.width - 10}px;`)
				: leftArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; left: ${fullTableCoords.left - leftArrowCoords.width - 10}px;`)

			renderTable(index, separatedKeys);
		}

		rightArrow?.setAttribute('style', `opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; right: ${1920 - fullTableCoords.right - rightArrowCoords.width - 30}px;`);
	};

	leftArrow?.addEventListener('click', handleLeftArrowClick);

	const handleRightArrowClick = () => {
		const fullTableCoords = fullTable.getBoundingClientRect();
		const rightArrowCoords = rightArrow.getBoundingClientRect();
		const leftArrowCoords = leftArrow.getBoundingClientRect();

		Storage.items.fullTableHeaders ? (allKeys = [...Storage.items.fullTableHeaders]) : (allKeys = Object.keys(arr[0]));

		if (index === separatedKeys.length - 1) {
			console.log('index === separatedKeys.length - 1');
			index = separatedKeys.length - 1;
			/*
			rightArrow?.setAttribute(
				'style',
				`opacity: 0; transition: 0.2s; height: 0px; align-self: flex-start; position: absolute; right: ${1920 - fullTableCoords.right - rightArrowCoords.width - 30}px;`
			);
			*/
			rightArrow.style.opacity = '0';
			rightArrow.disabled = true;
		} else {
			console.log('index !== separatedKeys.length');
			index += 1;
			leftArrow.disabled = false;
			rightArrow?.setAttribute(
				'style',
				`opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; right: ${1920 - fullTableCoords.right - rightArrowCoords.width - 30}px;`
			);
		}

		renderTable(index, separatedKeys);

		leftArrow?.setAttribute(
			'style',
			`opacity: 1; transition: 0.2s; height: 40px; align-self: flex-start; position: absolute; left: ${fullTableCoords.left - leftArrowCoords.width - 10}px;`
		);

		rightArrow?.addEventListener('click', handleRightArrowClick);
	};

	rightArrow?.addEventListener('click', handleRightArrowClick);
};
