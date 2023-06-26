import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const Storage: ICustomStorage = new CustomStorage();

export async function handleLeftDateChange() {

	// opt - one of the keys [tLogIn, tLogOut, tLastAcc]
	const select: HTMLSelectElement | null = document?.querySelector('#date-params');
	const opt: string | undefined = select?.options[select?.selectedIndex]?.value;

	if (Storage.items.secondDate?.value === '') {
		/**
	   * Looks for the latest date
	   * takes first object's key opt as initial value and checks if next is bigger or not
	   */
		if (Storage.items.secondDate.value === '') {
			if (opt) {
				const latestDate = Storage.items.data?.reduce((latest: Date, current: Record<string, any>) => {
					const currentDate: Date = new Date(current[opt]);
					return currentDate > latest ? currentDate : latest;
				}, new Date(Storage.items.data[0][opt]));

				const rightDateInput = document.querySelector<HTMLInputElement>('#right-date-inp');
				if (rightDateInput) {
					rightDateInput.value = `${latestDate?.toISOString().slice(0, 16)}`;
				}
			}
		}

	}

	/*
	Storage.items.dataSourceOption === 'Datenbank'
		? await DBQuery()
		: Storage.setItem('data', getFilters() as object[]);

	if (rowsAmount)
		rowsAmount.innerHTML = `${Storage.items.data?.length}`;

	let dropdownValues: { values: string[], valueToHeaderMap: object } | null = null;
	if (Storage.items.data && Storage.items.tableHeaders)
				dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

	Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		dropdownValues?.values.forEach((value: string) => {
			const option = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});

	dropdownValues = null;
	*/

	submitBtn.click();
}

export async function handleRightDateChange() {
    const select: HTMLSelectElement | null = document.querySelector('date-params');
	const opt = select?.options[select?.selectedIndex]?.value;

	if (Storage.items.secondDate?.value === '') {
		if (opt) {
			const latestDate = Storage.items.data?.reduce((latest: Date, current: Record<string, any>) => {
				const currentDate: Date = new Date(current[opt]);
				return currentDate < latest ? currentDate : latest;
			}, new Date(Storage.items.data[0][opt]));

			const rightDateInput = document.querySelector<HTMLInputElement>('#left-date-inp');
			if (rightDateInput) {
				rightDateInput.value = `${latestDate?.toISOString().slice(0, 16)}`;
			}
		}
	}


	/*
	Storage.items.dataSourceOption === 'Datenbank'
		? await DBQuery()
		: Storage.setItem('data', getFilters() as object[]);

	if (rowsAmount)
		rowsAmount.innerHTML = `${Storage.items.data?.length}`;

	let dropdownValues: { values: string[], valueToHeaderMap: object } | null = null;
	if (Storage.items.data && Storage.items.tableHeaders)
				dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

	Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		dropdownValues?.values.forEach((value: string) => {
			const option = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});
	dropdownValues = null;

	*/

	submitBtn.click();
}
