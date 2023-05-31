import CustomStorage from '../Storage/Local-Storage.js';
import fetchData from './FetchDbJSON.js';
const dateOptionSelector = document.querySelector('#date-params');
const Storage = new CustomStorage();
export default async function DBQuery() {
    console.log('DBQuery');
    if (Storage.items.limiter === undefined)
        Storage.setItem('limiter', 1000);
    let queryObjects = [];
    let args = '';
    const usedInputFields = Storage.items.inputFields.map((field) => {
        if (field.value !== '')
            return field;
    }).filter((field) => field !== undefined);
    if (Storage.items.firstDate.value && Storage.items.secondDate.value) {
        const dateOption = dateOptionSelector?.options[dateOptionSelector?.selectedIndex]?.value;
        Storage.setItem('firstDateQuery', `${Storage.items.firstDate.value.replace('T', ' ')}.00.000`);
        Storage.setItem('secondDateQuery', `${Storage.items.secondDate.value.replace('T', ' ')}.00.000`);
        queryObjects.push({ dateOption: dateOption }, { firstDate: Storage.items.firstDateQuery }, { secondDate: Storage.items.secondDateQuery });
    }
    if (usedInputFields.length > 0) {
        const usedDbSelects = Array.from(document.querySelectorAll('[id^="db-select-"]'));
        usedInputFields.forEach((field, index) => {
            const dbSelectOptionValue = usedDbSelects[index].options[usedDbSelects[index].selectedIndex].value;
            queryObjects?.push({ [`${dbSelectOptionValue}`]: field?.value });
        });
    }
    queryObjects.forEach((object, index) => {
        if (queryObjects && index !== queryObjects.length - 1) {
            for (const [key, value] of Object.entries(object))
                args += `${key}=${value}&`;
        }
        else
            for (const [key, value] of Object.entries(object))
                args += `${key}=${value}`;
    });
    if (args !== '')
        Storage.setItem('data', await fetchData(`/db-fetch?${args}`));
    else
        Storage.setItem('data', await fetchData('/db-fetch'));
    queryObjects = null;
}
