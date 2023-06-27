import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const Storage: ICustomStorage = new CustomStorage();

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const loadFiltersInput: HTMLInputElement | null = document.querySelector('#load-filters-inp');

export default async function handleLoadFilters() {
    const fileInput = document.getElementById('load-filters-inp') as HTMLInputElement;

    const handleInputChange = (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files.length > 0) {
            const file = target.files[0];

            const reader = new FileReader();

            reader.addEventListener('load', function (event) {
                const fileContent = event.target?.result as string;

                console.log(JSON.parse(fileContent));

                const parsedFileContent = JSON.parse(fileContent) as {
                    filters?: [number, string][];
                    headers?: string[]
                };

                if (parsedFileContent.filters && +parsedFileContent.filters.length !== 0) {
                    parsedFileContent.filters.forEach((filter: [number, string], index: number) => {
                        const filterInput = document.getElementById(`filter-input-${index + 1}`) as HTMLInputElement;
                        const dbSelect = document.getElementById(`db-select-${index + 1}`) as HTMLSelectElement;

                        console.log(filter);

                        filterInput.value = filter[1];
                        dbSelect.selectedIndex = +filter[0];
                    });
                }

                if (parsedFileContent.headers && +parsedFileContent.headers.length !== 0) {
                    Storage.setItem('tableHeadersFromFile', parsedFileContent.headers);
                }

                submitBtn.click();

                if (loadFiltersInput)
                    loadFiltersInput.value = '';
            });

            reader.readAsText(file);
        }
    };

    fileInput.addEventListener('change', handleInputChange);
}
