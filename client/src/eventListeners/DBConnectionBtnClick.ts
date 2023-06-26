import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import fetchData from "../utils/FetchDbJSON";
import fillStorage from "../services/Storage/FillStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const submitSection = document.querySelector('#submit-section') as HTMLDivElement;

const Storage: ICustomStorage = new CustomStorage();

export default async function HandleDBConnectionBtnClick() {
	try {
		Storage.setItem('data', await fetchData('http://localhost:3000/load-fetch') as object[]);

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

			if (!document.querySelector('#load-filters-inp')) {
				const loadFiltersBtn = `
					<label for="load-filters-inp" id="load-filters-lbl">Load filters</label>
					<input type="file" id="load-filters-inp" class="load-filters-inp" accept=".json, .csv">
				`;

				submitSection.insertAdjacentHTML('afterbegin', loadFiltersBtn);
			}
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
