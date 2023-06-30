import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import { DISPLAY } from "../utils/enums";

const Storage: ICustomStorage = new CustomStorage();

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const loadFiltersInput: HTMLInputElement | null = document.querySelector('#load-filters-inp');
const clearLoadedFiltersButton = document.querySelector('#load-filters-clear-btn') as HTMLButtonElement;

export async function handleLoadFilters() {
    const fileInput = document.getElementById('load-filters-inp') as HTMLInputElement;

    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
            const file = target.files[0];

            const reader = new FileReader();

            reader.addEventListener('load', function (event) {
                const fileContent = event.target?.result as string;

                const parsedFileContent = JSON.parse(fileContent) as {
                    filters?: [number, string][];
                    headers?: string[]
                };

                if (parsedFileContent.filters && +parsedFileContent.filters.length !== 0) {
                    parsedFileContent.filters.forEach((filter: [number, string], index: number) => {
                        const filterInput = document.getElementById(`filter-input-${index + 1}`) as HTMLInputElement;
                        const dbSelect = document.getElementById(`db-select-${index + 1}`) as HTMLSelectElement;

                        filterInput.value = filter[1];
                        dbSelect.selectedIndex = +filter[0];
                    });
                }

                if (parsedFileContent.headers && +parsedFileContent.headers.length !== 0) {
                    Storage.setItem('tableHeadersFromFile', parsedFileContent.headers);
                }

                clearLoadedFiltersButton.setAttribute('style', DISPLAY.FLEX);

                submitBtn.click();

                if (loadFiltersInput)
                    loadFiltersInput.value = '';
            });

            reader.readAsText(file);
        }
    };

    fileInput.addEventListener('change', handleInputChange);
}

export function handleFiltersClearButtonClick() {
    Storage.items.inputFields?.forEach((field: HTMLInputElement) => {
        field.value = '';
    })

    Storage.setItem('tableHeadersFromFile', null);

    clearLoadedFiltersButton.setAttribute('style', DISPLAY.NONE);

    submitBtn.click();
}
