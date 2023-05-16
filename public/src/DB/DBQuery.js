import { CustomStorage } from "../Storage/Local-Storage";

const Storage = new CustomStorage();

export default async function DBQuery() {
    console.log(Storage.items.inputFields);
    console.log(Storage.items.datalists);
    console.log(Storage.items.dbSelectors);
}
