import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import fetchData from './FetchDbJSON.js';
import { FullDataInterface } from './types.js';

const dateOptionSelector: HTMLSelectElement | null = document.querySelector('#date-params');

const Storage: ICustomStorage = new CustomStorage();

export default async function DBQuery() {
	if (!Storage.items.limiter)
		Storage.setItem('limiter', 1000);

	let queryObjects: object[] | null = [];
	let args = '';

	const usedInputFields: HTMLInputElement[] = (Storage.items.inputFields || [])
	.filter((field: HTMLInputElement | undefined): field is HTMLInputElement => field !== undefined)
	.filter((field: HTMLInputElement) => field.value !== '');


	if (Storage.items.firstDate?.value && Storage.items.secondDate?.value) {
		const dateOption: string | undefined = dateOptionSelector?.options[dateOptionSelector?.selectedIndex]?.value;

		Storage.setItem('firstDateQuery', `${Storage.items.firstDate.value.replace('T', ' ')}.00.000` as string);
		Storage.setItem('secondDateQuery', `${Storage.items.secondDate.value.replace('T', ' ')}.00.000` as string);

		queryObjects.push(
			{ dateOption: dateOption },
			{ firstDate: Storage.items.firstDateQuery },
			{ secondDate: Storage.items.secondDateQuery }
		);
	}

	if (usedInputFields?.length > 0) {
		const usedDbSelects: HTMLSelectElement[] = Array.from(document.querySelectorAll<HTMLSelectElement>('[id^="db-select-"]'));

		usedInputFields.forEach((field: HTMLInputElement) => {
			const index: number = +field.id.slice(13);

			const dbSelectOptionValue: string = usedDbSelects[index - 1].options[usedDbSelects[index - 1].selectedIndex].value;
			queryObjects?.push({ [`${dbSelectOptionValue}`]: field.value });
		});
	}

	queryObjects.push({ limiter: Storage.items.limiter });

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
		Storage.setItem('data', await fetchData(`http://localhost:3000/db-fetch?${args}`) as FullDataInterface[]);
	else
		Storage.setItem('data', await fetchData('http://localhost:3000/db-fetch') as FullDataInterface[]);

	queryObjects = null;
}
