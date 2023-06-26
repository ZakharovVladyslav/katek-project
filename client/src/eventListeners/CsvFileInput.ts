import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import fillStorage from "../services/Storage/FillStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const file = document.querySelector('#file-choose') as HTMLInputElement;
const chosenFile= document.querySelector('#chosen-file') as HTMLParagraphElement;

const Storage: ICustomStorage = new CustomStorage();

export default function handleCsvFileInput() {
    // As file inputted, submit button become active and clickable
    if (submitBtn)
    submitBtn.disabled = false;

    /**
    * Receive file name and put it to the site
    */
    const arrFromFileName: string[] = file.value.replaceAll('\\', ',').split(',');

    chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1];

    // FileReader will read file data as text
    const fileReader: FileReader = new FileReader();

    /**
    *  file.files - object that contains data about the file from input
    *  file.files[0] - file name
    */
    const handleLoadFileReader = (e: ProgressEvent) => {
        const target = e.target as FileReader;

        /**
         * e.target.result returns the whole data from the file. In this case in text
         * After text received, it stores in the Storage as inputText
         */
        const text: string | ArrayBuffer | null | undefined = target?.result;
        Storage.setItem('inputText', text as string | ArrayBuffer);

        fillStorage();
    };
    fileReader.addEventListener('load', handleLoadFileReader);

    // Set fileReader to read data from .csv file as text
    if (file.files)
    fileReader.readAsText(file.files[0]);
}
