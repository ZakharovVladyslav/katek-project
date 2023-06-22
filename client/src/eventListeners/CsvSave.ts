const saveButton = document.querySelector('#save') as HTMLButtonElement;

import CustomStorage from "../services/Storage/CustomStorage";
const Storage = new CustomStorage();

export default async function SaveDataInCsv() {
    Storage.setItem('RefinedData', [[...Storage.items.allHeaders]] as string[][]);

    Storage.items.data.forEach((obj: object) => {
        let arr: object[] | null = Storage.items.RefinedData;
        arr?.push(obj);

        Storage.setItem('RefinedData', arr as object[]);
        arr = null;
    });

    if (Storage.items.saveOption === 'Table') {
        let csvContent: string | null = '';

        Storage.items.RefinedData.forEach((row: object) => {
            csvContent += Object.values(row).join(',') + '\n';
        });

        Storage.setItem('csvContent', csvContent as string);
        Storage.setItem('fileType', 'Table' as string);

        csvContent = null;
    }

    else if (Storage.items.saveOption === 'Headers') {
        Storage.setItem('csvContent', '');
        Storage.setItem('jsonContent', JSON.stringify(Storage.items.selectedHeaders, null, 4) as string);
        Storage.setItem('fileType', 'Headers' as string);
    }

    else if (Storage.items.saveOption === 'Filters') {
        Storage.setItem('csvContent', '' as string);

        const filters = Storage.items.inputFields.map((input: HTMLInputElement | null, index: number) => {
            if (input && input.value !== '')
                return [Storage.items.dbSelects[index].selectedIndex, input.value];
        }).filter((input: HTMLInputElement) => input !== undefined);

        console.log(filters);

        Storage.setItem('jsonContent', JSON.stringify(filters, null, 4) as string);
        Storage.setItem('fileType', 'Filters' as string);
    }

    else if (Storage.items.saveOption === 'Headers & Filters') {
        Storage.setItem('csvContent', '' as string);

        const filters = Storage.items.inputFields.map((input: HTMLInputElement) => {
            if (input.value !== '')
                return input.value;
        }).filter((input: HTMLInputElement) => input !== undefined);

        let jsonContent: object = {};

        jsonContent = { ...jsonContent, headers: Storage.items.selectedHeaders };
        jsonContent = { ...jsonContent, filters: filters };

        Storage.setItem('jsonContent', JSON.stringify(jsonContent, null, 4) as string);
        Storage.setItem('fileType', 'Headers-and-filters' as string);
    }


    Storage.items.csvContent === ''
        ? Storage.setItem('blob', new Blob([Storage.items.jsonContent], { type: 'application/json' }) as Blob)
        : Storage.setItem('blob', new Blob([Storage.items.csvContent], { type: 'text/csv; charset=utf-8' }) as Blob);


    const objUrl: string = URL.createObjectURL(Storage.items.blob);
    saveButton?.setAttribute('href', objUrl);

    const dateNow: Date = new Date();
    saveButton?.setAttribute('download', `${Storage.items.fileType}-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`);

    delete Storage.items.RefinedData;
}
