import CustomStorage from "../services/Storage/CustomStorage";
import fetchData from "../utils/FetchDbJSON";
import fillStorage from "../services/Storage/FillStorage";
import DBQuery from "../utils/DBQuery";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const submitSection = document.querySelector('#submit-section') as HTMLDivElement;

const Storage = new CustomStorage();

export default async function HandleDBConnectionBtnClick() {
    console.log('db connect');
	try {
		console.log('db try');
		Storage.setItem('data', await fetchData('http://localhost:3000/load-fetch') as object[]);
		console.log('db after fetch');

		if (Storage.items.data) {
			const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

			if (document.querySelector('#connection-check'))
				document.querySelector('#connection-check')?.remove();

			if (document.querySelector('#connection-error'))
				document.querySelector('#connection-error')?.remove();

			const connectionCheckHTML = `
            <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
         `;

			dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

			fillStorage();

			submitBtn.disabled = false;
			submitBtn?.click();

			const loadFiltersBtn = `
				<label for="load-filters-inp" id="load-filters-lbl">Load filters</label>
				<input type="file" id="load-filters-inp" class="load-filters-inp" accept=".json, .csv">
			`;

			submitSection.insertAdjacentHTML('afterbegin', loadFiltersBtn);

			Storage.setItem('loadFiltersInput', document.querySelector('#load-filters-inp') as HTMLInputElement);

			Storage.items.loadFiltersInput?.addEventListener('input', () => {
				const reader = new FileReader();

				reader.addEventListener('load', async (e: ProgressEvent) => {
					const fileContent = e.target as FileReader;
					const filtersFromFile: string | ArrayBuffer | null | undefined = fileContent?.result;

					Storage.setItem('filtersFromJson', filtersFromFile);

					const content = JSON.parse(Storage.items.filtersFromJson);
					let filters: string[][];

					Array.isArray(content) ? filters = content : filters = content.filters;

					filters.forEach((filter: string[], index: number) => {
						Storage.items.dbSelects[index].selectedIndex = filter[0]
						Storage.items.inputFields[index].value = filter[1];
					})

					await DBQuery();

					submitBtn.click();
				})

				if (Storage.items.loadFiltersInput.files)
					reader.readAsText(Storage.items.loadFiltersInput.files[0]);
			})
		}
	} catch (err) {
		const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

		if (document.querySelector('#connection-check'))
			document.querySelector('#connection-check')?.remove();

		if (document.querySelector('#connection-error'))
			document.querySelector('#connection-error')?.remove();

		const connectionCheckHTML = `
         <i class="fa-solid fa-xmark fa-2xl" style="color: #f00000;" id="connection-error"></i>
      `;

		dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

		setTimeout(() => {
			const connectionCheckElement = document.getElementById('connection-error');
			if (connectionCheckElement) {
				connectionCheckElement.remove();
			}
		}, 2500);

		console.log(err);
	}
}
