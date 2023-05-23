import CsvToArray from "../Data/Convert-csv.js";
import CustomStorage from "./Local-Storage.js";
import DropdownValues from "../Data/Dropdown-values.js";
const rowsAmount = document.querySelector('#rows-amount');

const Storage = new CustomStorage();

export default function fillStorage() {
    /**
     * TableHeaders - needed for the table to print only exact columns
     * Also stores into the Storage to be able to be called later
    */
    const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc'];
    Storage.setItem('tableHeaders', tableHeaders)

    Storage.setItem('selectedHeaders', []);

    /**
     * delimiterOption - in Convert-csv delimiter has delimiter by default ','
     * If selected delimiterOption will be different from the default, it will be overwritten
    */
    const delimiterSelection = document.querySelector('#delimiter-selection');

    let delimiterOption = null;
    if (delimiterSelection)
        delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value;

    if (Storage.items.data) {
        // StaticData - stored to be a full version of initial array
        Storage.setItem('staticData', Storage.items.data);

        // AllHeaders - needs for reset listener to fill dropdown immediately
        Storage.setItem('allHeaders', Object.keys(Storage.items.staticData[0]));

        // StaticDataLength - stored, not to calculate length later
        Storage.setItem('staticDataLength', Storage.items.staticData.length);
        Storage.setItem('headers', Object.keys(Storage.items.data[0]));

        // AllValues - as same as allHeaders. not to calculate later. Receives all present value from the static data
        Storage.setItem('allValues', DropdownValues(Storage.items.staticData, Storage.items.tableHeaders));

        // Stored not to keep text present as it takes lot of memory
        Storage.setItem('inputTextLength', Storage.items.data.length);
    }

    Storage.setItem('firstDate', document.querySelector('#left-date-inp'));
    Storage.setItem('secondDate', document.querySelector('#right-date-inp'));

    const headersMap = new Map();
    Storage.items.tableHeaders.forEach((header, index) => {
        headersMap.set(`${index}`, `${header}`);
    })

    Storage.setItem('objectKeysMap', headersMap);

    if (Storage.items.data) {
        /**
         * dbSelects - select html elements near to input field
         * needed for db connection to define by which key database will be stored
         *
         * Is fullfilled with all column names (headers) from the file
         */
        Storage.items.dbSelects.forEach(select => {
            select.innerHTML = ''

            const option = document.createElement('option')
            option.className = 'database-option';
            option.value = 'Select';
            option.innerHTML = 'Select';
            select.appendChild(option)

            Object.keys(Storage.items.data[0]).forEach(header => {
                const option = document.createElement('option');
                option.className = 'database-option';
                option.value = header;
                option.innerHTML = header;
                select.appendChild(option);
            })
        })
        // Number of rows of the updated array will be outputted
        rowsAmount.innerHTML = Storage.items.data.length;

        // Values from updated file data to fullfill dropdowns only with actual values
        let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

        Storage.items.datalists.forEach(datalist => {
            datalist.innerHTML = '';

            dropdownValues.values.forEach(value => {
                const option = document.createElement('option');
                option.className = 'datalist-option';
                option.value = value;
                datalist.appendChild(option);
            })
        })

        dropdownValues = null;
    }

    // Text will be deleted not to take memory for no reason
    delete Storage.items.inputText;
}
