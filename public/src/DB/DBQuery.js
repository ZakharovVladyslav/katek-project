import { CustomStorage, SecondaryStorage } from "../Storage/Local-Storage.js";
import fetchData from "./FetchDbJSON.js";

const Storage = new CustomStorage();
const MinorStorage = new SecondaryStorage();

export default async function DBQuery(e) {
    if (Storage.items.limiter === undefined)
        Storage.setItem('limiter', 5000);

    const usedInputFields = Storage.items.inputFields.map(field => {
        if (field.value !== '')
            return field;
    }).filter(field => field !== undefined);

    if (usedInputFields.length > 0) {
        const usedDbSelects = usedInputFields.map((field, index) => {
            return document.querySelector(`#db-select-${index + 1}`)
        })

        let queryObjects = null;

        queryObjects = usedInputFields.map((field, index) => {
            const dbSelectOptionValue = usedDbSelects[index].options[usedDbSelects[index].selectedIndex].value;

            return {
                [`${dbSelectOptionValue}`]: field.value
            }
        })

        queryObjects.push({ limiter: Storage.items.limiter });

        let args = ''
        queryObjects.forEach((object, index) => {
            if (index !== queryObjects.length - 1) {
                for (let [key, value] of Object.entries(object))
                    args += `${key}=${value}&`
            }
            else
                for (let [key, value] of Object.entries(object))
                    args += `${key}=${value}`
        })

        Storage.setItem('data', await fetchData(`/db-fetch?${args}`));
    }
    else {
        Storage.setItem('data', await fetchData(`/db-fetch?limiter=${Storage.items.limiter}`));
    }
}
