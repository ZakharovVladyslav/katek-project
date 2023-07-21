import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import DBQuery from "../utils/dBQuery";
import getFilters from "../utils/data-filtering";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const Storage: ICustomStorage = new CustomStorage();

export default async function handleFiltersEraserClick(e: MouseEvent) {
	const target = e.target as HTMLElement;

	if (target?.id.substring(0, 6) === 'eraser') {
		const targetId: string = target?.id.slice(7);

		if (Storage.items.inputFields && Storage.items.dbSelects) {
			Storage.items.inputFields[+targetId - 1].value = '';
			Storage.items.dbSelects[+targetId - 1].selectedIndex = 0;
		}

		Storage.items.dataSourceOption === 'Datenbank'
			? await DBQuery()
			: Storage.setItem('data', getFilters() as object[]);

		Storage.setItem('limiter', '1000');

		submitBtn.click();
	}
};
