import { FullDataInterface } from "./types";

function removeSingleValues(arr: string[]) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const result: any[] = [];
	let currentHeader: string | null = null;
	let currentValues: (string | number)[] = [];

	for (let i = 0; i < arr.length; i++) {
		const currentItem: string = arr[i];

		if (typeof currentItem === 'string' && currentItem.startsWith('----')) {
			if (currentHeader !== null && currentValues.length > 1) {
				result.push(currentHeader, ...currentValues);
			}

			currentHeader = currentItem;
			currentValues = [];
		} else {
			currentValues.push(currentItem);
		}
	}
	if (currentHeader !== null && currentValues.length > 1) {
		result.push(currentHeader, ...currentValues);
	}

	return result;
}

export default function DropdownValues(array: FullDataInterface[], headers: string[]) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const resultArray: any[] = [];
	const timeKeys: string[] = ['tLogIn', 'tLogOut', 'tLastAcc'];
	const valuesMap: Map<string, string[]> = new Map();

	console.log(array);

	const mapHeaders = headers.filter((header: string) => !timeKeys.includes(header));

	mapHeaders.forEach((header: string) => {
		valuesMap.set(`${header}`, [`---- ${header} ----`]);
	});

	array.forEach((obj: Record<string, any>) => {
		for (const key of Object.keys(obj)) {
			if (headers.includes(key) && !timeKeys.includes(key)) {
				const arr = valuesMap.get(`${key}`);
				arr?.push(obj[key]);
			}
		}
	});

	valuesMap.forEach((arr: string[], header: string) => {
		arr = arr.filter(elem => elem !== '');

		if (arr.length > 1)
			resultArray.push(arr);

		valuesMap.set(header, arr.slice(1)); // Remove header from the array
	});

	let flattenedArray: string[] = Array.from(new Set(resultArray.flat(Infinity)));

	const valueToHeaderMap: Map<string | number, string | number> = new Map();
	array.forEach((obj: Record<string, any>) => {
		for (const key of Object.keys(obj)) {
			if (headers.includes(key) && !timeKeys.includes(key)) {
				const value: string | number = obj[key];
				valueToHeaderMap.set(value, key);
			}
		}
	});

	flattenedArray = removeSingleValues(flattenedArray);


	return {
		values: flattenedArray as string[],
		valueToHeaderMap: Object.fromEntries(valueToHeaderMap) as object
	};
}
