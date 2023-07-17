import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const Storage: ICustomStorage = new CustomStorage();

const rowLimiterInput = document.querySelector('#row-limiter') as HTMLInputElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

export default async function showMoreResults() {
    const currentRowLimiter: string = rowLimiterInput.value;
    const newRowLimiter: number = +currentRowLimiter + 300;

    Storage.setItem('limiter', newRowLimiter);

    rowLimiterInput.value = `${Storage.items.limiter}`;

    console.log(Storage.items.limiter);

    submitBtn.click();
}
