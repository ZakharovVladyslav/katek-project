'use strict'

import { CustomStorage } from "./CustomStorage.js";

const Storage = new CustomStorage();

export default function getFilters() {
    Storage.editCore('firstDate', document.querySelector('#left-date-inp'));
    Storage.editCore('secondDate', document.querySelector('#right-date-inp'));

    let data = [...Storage.core.staticDataArray];

    if (Storage.core.firstDate.value.length !== 0 && Storage.core.secondDate.value.length !== 0) {
        const select = document.getElementById('date-params');
        const opt = select.options[select.selectedIndex].value;

        const revertDate = (date) => {
            const arr = date.split('-').reverse();

            return `${+arr[1]}/${+arr[0]}/${+arr[2]}`;
        }

        const leftDateArr = revertDate(Storage.core.firstDate.value);
        const rigthDateArr = revertDate(Storage.core.secondDate.value);

        data = data.filter(elem => {
            if (elem[opt] !== undefined) {
                let targetDate = elem[opt].split('');

                if (targetDate.length > 10) {
                    targetDate.length = 10;

                    targetDate = targetDate.join('').split('.');

                    let date = `${+targetDate[0]}/${+targetDate[1]}/${+targetDate[2]}`;

                    if (new Date(leftDateArr) <= new Date(date) && new Date(date) <= new Date(rigthDateArr)) {
                        return elem;
                    }
                }
            }
        })
    }

    let inputFields = [
        document.querySelector('#filter-input-1'),
        document.querySelector('#filter-input-2'),
        document.querySelector('#filter-input-3'),
        document.querySelector('#filter-input-4'),
        document.querySelector('#filter-input-5')
    ];
    let filteredArray = [];

    inputFields = inputFields.filter(field => field.value !== '');

    const values = inputFields.map(filter => {
        if (filter.value !== '')
            return filter.value;
    }).filter(filter => filter !== undefined);

    let keys = [];
    let avoidableKeys = ['tLatenz', 'tLatenzSumme', 'tCycle', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

    data.forEach(obj => {
        values.forEach(value => {
            Object.keys(obj).forEach(key => {
                if (obj[key] === value && !avoidableKeys.includes(key)) {
                    keys.push(key);
                }
            })
        })
    })

    keys = Array.from(new Set(keys));

    filteredArray = data.filter(obj => {
        return keys.every(key => {
            return values.includes(obj[key]);
        })
    })

    data = null;

    return filteredArray;
}
