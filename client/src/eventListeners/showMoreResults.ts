import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const Storage: ICustomStorage = new CustomStorage();

const rowLimiterInput = document.querySelector('#row-limiter') as HTMLInputElement;

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const scrollToTheBottomBtn = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

export default function showMoreResults() {
    const currentRowLimiter: string = rowLimiterInput.value;
    const newRowLimiter: number = +currentRowLimiter + 300;

    Storage.setItem('limiter', newRowLimiter);

    rowLimiterInput.value = `${Storage.items.limiter}`;

    scrollToTheBottomBtn.style.opacity = '1';

    submitBtn.click();
}
