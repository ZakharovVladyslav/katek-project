'use strict';
import CustomStorage from '../Storage/Local-Storage.js';
const Storage = new CustomStorage();
export default function getFilters() {
    Storage.setItem('firstDate', document.querySelector('#left-date-inp')?.value || '');
    Storage.setItem('secondDate', document.querySelector('#right-date-inp')?.value || '');
    let inputData = [...Storage.items.staticData];
    const select = document.getElementById('date-params');
    const opt = select?.options[select?.selectedIndex]?.value;
    const startDate = new Date(Storage.items.firstDate.value);
    const finishDate = new Date(Storage.items.secondDate.value);
    if (Storage.items.firstDate.value !== '' && Storage.items.secondDate.value !== '') {
        if (opt) {
            inputData = inputData.filter((object) => {
                const objectDate = new Date(object[opt]);
                return objectDate >= startDate && objectDate < finishDate;
            });
        }
    }
    let inputFields = [
        document.querySelector('#filter-input-1'),
        document.querySelector('#filter-input-2'),
        document.querySelector('#filter-input-3'),
        document.querySelector('#filter-input-4'),
        document.querySelector('#filter-input-5'),
    ];
    let filteredArray = [];
    inputFields = inputFields.filter((field) => field?.value !== '');
    const values = inputFields.map((filter) => filter.value).filter((filter) => filter !== undefined);
    let keys = [];
    const avoidableKeys = ['tLatenz', 'tLatenzSumme', 'tCycle', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];
    inputData.forEach((obj) => {
        values.forEach((value) => {
            Object.keys(obj).forEach((key) => {
                if (obj[key] === value && !avoidableKeys.includes(key)) {
                    keys.push(key);
                }
            });
        });
    });
    keys = Array.from(new Set(keys));
    filteredArray = inputData.filter((obj) => {
        return keys.every((key) => {
            return values.includes(obj[key]);
        });
    });
    inputData = undefined;
    return filteredArray;
}
