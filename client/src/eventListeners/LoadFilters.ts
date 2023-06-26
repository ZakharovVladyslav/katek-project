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
                const filters = JSON.parse(fileContent) as [number, string][];

                filters.forEach((filter, index) => {
                    const filterInput = document.getElementById(`filter-input-${index + 1}`) as HTMLInputElement;
                    const dbSelect = document.getElementById(`db-select-${index + 1}`) as HTMLSelectElement;

                    filterInput.value = filter[1];
                    dbSelect.selectedIndex = filter[0];
                });

                submitBtn.click();

                if (loadFiltersInput)
                    loadFiltersInput.value = '';
            });

            reader.readAsText(file);
        }
    };

    fileInput.addEventListener('change', handleInputChange);
}
