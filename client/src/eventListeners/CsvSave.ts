const saveButton = document.querySelector('#save') as HTMLButtonElement;
const callPopupWindowButton = document.querySelector('#call-popup') as HTMLButtonElement;

import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
const Storage: ICustomStorage = new CustomStorage();

export default async function SaveDataInCsv() {
    Storage.setItem('RefinedData', [[...Storage.items.allHeaders!]] as string[][]);

    Storage.items.data?.forEach((obj: object) => {
        let arr: object[] | null = Storage.items.RefinedData!;
        arr?.push(obj);

        Storage.setItem('RefinedData', arr as object[]);
        arr = null;
    });

    if (Storage.items.saveOption === 'Table') {
        let csvContent: string | null = '';

        Storage.items.RefinedData?.forEach((row: object) => {
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
        callPopupWindowButton.style.display = 'inline-block';

        Storage.setItem('csvContent', '' as string);

        const filters: (string | number)[][] = (Storage.items.inputFields ?? [])
        .map((input: HTMLInputElement | null, index: number): (string | number)[] | undefined => {
            if (input && input.value !== '')
                return [Storage.items.dbSelects![index].selectedIndex, input.value];
            return undefined;
        })
        .filter((input: (string | number)[] | undefined): input is (string | number)[] => input !== undefined);

        Storage.setItem('jsonContent', JSON.stringify(filters, null, 4) as string);
        Storage.setItem('fileType', 'Filters' as string);
    }

    else if (Storage.items.saveOption === 'Headers & Filters') {
        callPopupWindowButton.style.display = 'inline-block';

        Storage.setItem('csvContent', '' as string);

        const filters: (string | number)[][] = (Storage.items.inputFields ?? [])
        .map((input: HTMLInputElement | null, index: number): (string | number)[] | undefined => {
            if (input && input.value !== '')
                return [Storage.items.dbSelects![index].selectedIndex, input.value];
            return undefined;
        })
        .filter((input: (string | number)[] | undefined): input is (string | number)[] => input !== undefined);

        let jsonContent: object = {};

        jsonContent = { ...jsonContent, headers: Storage.items.selectedHeaders };
        jsonContent = { ...jsonContent, filters: filters };

        Storage.setItem('jsonContent', JSON.stringify(jsonContent, null, 4) as string);
        Storage.setItem('fileType', 'Headers-and-filters' as string);
    }


    Storage.items.csvContent === ''
        ? Storage.setItem('blob', new Blob([Storage.items.jsonContent!], { type: 'application/json' }) as Blob)
        : Storage.setItem('blob', new Blob([Storage.items.csvContent!], { type: 'text/csv; charset=utf-8' }) as Blob);


    const objUrl: string = URL.createObjectURL(Storage.items.blob!);
    saveButton?.setAttribute('href', objUrl);

    const dateNow: Date = new Date();
    saveButton?.setAttribute('download', `${Storage.items.fileType}-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`);

    delete Storage.items.RefinedData;
}
