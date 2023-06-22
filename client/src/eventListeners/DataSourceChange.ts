import CsvToArray from "../utils/Convert-csv";
import CustomStorage from "../services/Storage/CustomStorage";
import fillStorage from "../services/Storage/FillStorage";
import DBQuery from "../utils/DBQuery";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const reloadTable = document.querySelector('#reload-table') as HTMLButtonElement;
const fullTableBtn = document.querySelector('#full-table-button') as HTMLButtonElement;

const dataTable = document.querySelector('#data-table') as HTMLTableElement;

const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const submitSection = document.querySelector('#submit-section') as HTMLDivElement;

const SummaryTableInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox') as HTMLInputElement;

const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;

const Storage = new CustomStorage();

export default function handleDataSourceChange () {
	submitBtn.disabled = true;
	dataTable.innerHTML = '';
	overTables.style.display = 'none';

	submitBtn.disabled = true;
	resetBtn.disabled = true;
	fullTableBtn.disabled = true;
	SummaryTableInput.disabled = true;
	pieDiagrammInput.disabled = true;
	reloadTable.disabled = true;

	Storage.setItem('dataSourceOption', dataSource?.options[dataSource.selectedIndex].value as string);

	const fileInputSection: HTMLDivElement | null = document.querySelector('#file-input-section');

	if (Storage.items.dataSourceOption === 'Datei') {
		if (fileInputSection)
			fileInputSection.innerHTML = '';

		const html = `
         <select id="delimiter-selection">
            <option id="delimiter-selection-option">,</option>
            <option id="delimiter-selection-option">;</option>
         </select>

         <label id="fc" for="file-choose">Datei öffnen</label>
         <input type="file" id="file-choose"><br>
         <p id="chosen-file" style="display: none;"></p>
      	`;

		fileInputSection?.insertAdjacentHTML('beforeend', html);

		const file = document.querySelector('#file-choose') as HTMLInputElement;
		const chosenFile = document.querySelector('#chosen-file') as HTMLParagraphElement;

		file.addEventListener('input', () => {
			// As file inputted, submit button become active and clickable
			submitBtn.disabled = true;

			/**
				 * Receive file name and put it to the site
				 */
			const arrFromFileName: string[] = file?.value.replaceAll('\\', ',').split(',');

			chosenFile?.setAttribute('innerHTML', arrFromFileName[arrFromFileName.length - 1]);

			// FileReader will read file data as text
			const fileReader: FileReader = new FileReader();

			/**
				 *  file.files - object that contains data about the file from input
				 *  file.files[0] - file name
				*/
			fileReader?.addEventListener('load', (e: ProgressEvent) => {
				/**
					* e.target.result returns the whole data from the file. In this case in text
					* After text received, it stores in the Storage as inputText
					*/
				const target = e.target as FileReader;

				const text: string | ArrayBuffer | null | undefined = target?.result;

				Storage.setItem('inputText', text);

				const delimiterSelection: HTMLSelectElement | null = document.querySelector('#delimiter-selection');

				const delimiterOption: string | undefined = delimiterSelection?.options[delimiterSelection?.selectedIndex]?.value;

				/**
				 * Data will be stored as a result object[] from .csv text
				 */
				Storage.setItem('data', CsvToArray(Storage.items.inputText, delimiterOption).filter((obj) => {
					return !Object.values(obj).includes(undefined);
				}));

				fillStorage();

				submitBtn.disabled = false;
				submitBtn.click();

				const loadFiltersBtn = `
					<label for="load-filters-inp" id="load-filters-lbl">Load filters</label>
					<input type="file" id="load-filters-inp" class="load-filters-inp" accept=".json">
				`;

				submitSection.insertAdjacentHTML('afterbegin', loadFiltersBtn);

				Storage.setItem('loadFiltersInput', document.querySelector('#load-filters-inp') as HTMLInputElement);

				Storage.items.loadFiltersInput?.addEventListener('input', () => {
					const reader = new FileReader();

					reader.addEventListener('load', (e: ProgressEvent) => {
						const content = e.target as FileReader;
						const filters: string | ArrayBuffer | null | undefined = content?.result;

						Storage.setItem('filtersFromJson', filters);
					})

					console.log(Storage.items.filtersFromJson);

					if (Storage.items.loadFiltersInput.files)
						reader.readAsText(Storage.items.loadFiltersInput.files[0]);
				})
			});

			// Set fileReader to read data from .csv file as text
			if (file.files)
				fileReader.readAsText(file.files[0]);
		});
	}
	else if (Storage.items.dataSourceOption === 'Datenbank') {
		if (fileInputSection && dataTable) {
			fileInputSection.innerHTML = '';
			dataTable.innerHTML = '';
		}

		const html = `
         <div id="db-connect-div" class="db-connect-div">
            <button
               type="button"
               id="db-connect"
               class='db-connect'
            >Connect database</button>
         </div>
      `;

		fileInputSection?.insertAdjacentHTML('beforeend', html);

		const dbConnectBtn: HTMLButtonElement | null = document.querySelector('#db-connect');
		const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

		const handleDbConnectBtnClick = async () => {
			try {
				await DBQuery();

				if (submitBtn)
					submitBtn.disabled = false;

				const connectionCheckHTML = `
               <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
            `;

				dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

				fillStorage();
			} catch (err) {
				console.log(err);
			}
		};
		dbConnectBtn?.addEventListener('click', handleDbConnectBtnClick);

		submitBtn.disabled = false;
		submitBtn.click();

		const loadFiltersBtn = `
			<label for="load-filters-inp" id="load-filters-lbl">Load filters</label>
			<input type="file" id="load-filters-inp" class="load-filters-inp" accept=".json">
		`;

		submitSection.insertAdjacentHTML('afterbegin', loadFiltersBtn);

		Storage.setItem('loadFiltersInput', document.querySelector('#load-filters-inp') as HTMLInputElement);

		Storage.items.loadFiltersInput?.addEventListener('input', () => {
			const reader = new FileReader();

			reader.addEventListener('load', (e: ProgressEvent) => {
				const content = e.target as FileReader;
				const filters: string | ArrayBuffer | null | undefined = content?.result;

				if (typeof(filters) === 'string')
					Storage.setItem('filtersFromJson', JSON.parse(filters));
			})

			console.log(Storage.items.filtersFromJson);

			if (Storage.items.loadFiltersInput.files)
				reader.readAsText(Storage.items.loadFiltersInput.files[0]);
		})
	}
};
