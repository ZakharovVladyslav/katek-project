import CustomStorage from '../Storage/Local-Storage.js';
import fetchData from '../../utils/FetchDbJSON.js';

const dateOptionSelector: HTMLSelectElement | null = document.querySelector('#date-params');

const Storage = new CustomStorage();

export default async function DBQuery() {
	console.log('DBQuery');

	if (Storage.items.limiter === undefined)
		Storage.setItem('limiter', 1000);

	let queryObjects: object[] | null = [];
	let args = '';

	const usedInputFields: HTMLSelectElement[] = Storage.items.inputFields.map((field: HTMLInputElement) => {
		if (field.value !== '')
			return field;
	}).filter((field: HTMLSelectElement | undefined) => field !== undefined);

	if (Storage.items.firstDate.value && Storage.items.secondDate.value) {
		const dateOption: string | undefined = dateOptionSelector?.options[dateOptionSelector?.selectedIndex]?.value;

		Storage.setItem('firstDateQuery', `${Storage.items.firstDate.value.replace('T', ' ')}.00.000`);
		Storage.setItem('secondDateQuery', `${Storage.items.secondDate.value.replace('T', ' ')}.00.000`);

		queryObjects.push(
			{ dateOption: dateOption },
			{ firstDate: Storage.items.firstDateQuery },
			{ secondDate: Storage.items.secondDateQuery }
		);
	}

	if (usedInputFields.length > 0) {
		const usedDbSelects: HTMLSelectElement[] = Array.from(document.querySelectorAll<HTMLSelectElement>('[id^="db-select-"]'));

		usedInputFields.forEach((field: HTMLSelectElement | null, index: number) => {
			const dbSelectOptionValue: string = usedDbSelects[index].options[usedDbSelects[index].selectedIndex].value;

			queryObjects?.push({ [`${dbSelectOptionValue}`]: field?.value });
		});
	}

	queryObjects.forEach((object: object, index: number) => {
		if (queryObjects && index !== queryObjects.length - 1) {
			for (const [key, value] of Object.entries(object))
				args += `${key}=${value}&`;
		}
		else
			for (const [key, value] of Object.entries(object))
				args += `${key}=${value}`;
	});

	if (args !== '')
		Storage.setItem('data', await fetchData(`/db-fetch?${args}`) as object[]);
	else
		Storage.setItem('data', await fetchData('/db-fetch') as object[]);

	queryObjects = null;
}
