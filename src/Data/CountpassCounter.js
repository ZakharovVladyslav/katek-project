import CustomStorage from "../Storage/Local-Storage.js";
import LocalStacks from "../Stack/LocalStack.js";
import fetchData from "../DB/FetchDbJSON.js";

const countpassDiv = document.querySelector('#countpass-counter-div');
const countpassLabel = document.querySelector('#countpass-label');
const countpassCounter = document.querySelector('#countpass-counter');
const countpassErrorMsg = document.querySelector('#countpass-error-message');
const countpassWrapper = document.querySelector('#countpass-counter-wrapper');
const dateOptionSelector = document.querySelector('#date-params');
const distractProcentParag = document.querySelector('#distract-procent');

const Storage = new CustomStorage();
const LocalStack = new LocalStacks();

const fetchCountPass = async (firstDate, secondDate) => {
    let firstDateQuery = firstDate;
    let secondDateQuery = secondDate;

    if (firstDateQuery.includes('T'))
        firstDateQuery = `${firstDate.replace('T', ' ')}.00.000}`;
    if (secondDateQuery.includes('T'))
        secondDateQuery = `${secondDate.replace('T', ' ')}.00.000}`;

    let queryObjects = [];
    let args = '';

    const usedInputFields = Storage.items.inputFields.map(field => {
        if (field.value !== '')
            return field;
    }).filter(field => field !== undefined);

    const dateOption = dateOptionSelector.options[dateOptionSelector.selectedIndex].value;

    queryObjects.push(
        { dateOption: dateOption },
        { firstDate: firstDateQuery },
        { secondDate: secondDateQuery }
    );

    if (usedInputFields.length > 0) {
        const usedDbSelects = usedInputFields.map((field, index) => {
            return document.querySelector(`#db-select-${index + 1}`)
        })

        usedInputFields.forEach((field, index) => {
            const dbSelectOptionValue = usedDbSelects[index].options[usedDbSelects[index].selectedIndex].value;

            queryObjects.push({ [`${dbSelectOptionValue}`]: field.value })
        })
    }

    queryObjects.forEach((object, index) => {
        if (index !== queryObjects.length - 1) {
            for (let [key, value] of Object.entries(object))
                args += `${key}=${value}&`
        }
        else
            for (let [key, value] of Object.entries(object))
                args += `${key}=${value}`
    })

    queryObjects = null;

    // const result = await fetchData(`/get-countpass?${args}`);
    return await fetchData(`/get-countpass?${args}`);
}

const compareCountPasses = async () => {
    const previousCountPass = await fetchCountPass(LocalStack.peek('firstDateStack'), LocalStack.peek('secondDateStack'));
    const newCountPass = await fetchCountPass(Storage.items.firstDate.value, Storage.items.secondDate.value);

    const difference = previousCountPass.length - newCountPass.length;
    const percentageDifference = (difference / previousCountPass.length) * 100;
    return percentageDifference.toFixed(2);
}

export default async function CountpassCounter(countpassValue) {
    countpassDiv.style.opacity = '1';

    if (Storage.items.firstDate.value && Storage.items.secondDate.value) {
        const startDateTime = new Date(Storage.items.firstDate.value).getTime();
        const endDateTime = new Date(Storage.items.secondDate.value).getTime();

        // Calculate the difference in milliseconds
        const differenceMs = endDateTime - startDateTime;

        // Convert milliseconds to minutes
        const differenceMinutes = Math.floor(differenceMs / (1000 * 60));

        // Calculate the acceptable range in minutes (8 hours plus or minus 10 minutes)
        const acceptableRange = 8 * 60 + 2;

        // Check if the difference is within the acceptable range
        if (Math.abs(differenceMinutes) <= acceptableRange) {
            countpassCounter.innerHTML = `${countpassValue}`;

            if (LocalStack.peek('firstDateStack') !== null && LocalStack.peek('secondDateStack') !== null) {
                if (
                    LocalStack.peek('firstDateStack') !== Storage.items.firstDate.value ||
                    LocalStack.peek('secondDateStack') !== Storage.items.secondDate.value
                ) {
                    const previousCountPass = await fetchCountPass(LocalStack.peek('firstDateStack'), LocalStack.peek('secondDateStack'));
                    const newCountPass = await fetchCountPass(Storage.items.firstDate.value, Storage.items.secondDate.value);

                    const difference = previousCountPass.length - newCountPass.length;
                    const percentageDifference = (difference / previousCountPass.length) * 100;

                    const countPassDifference = percentageDifference.toFixed(2);

                    const number = countpassCounter.innerHTML;
                    countpassCounter.innerHTML = `${((percentageDifference / 100) * number).toFixed(2)}`;

                    distractProcentParag.innerHTML = `-${countPassDifference}%`;
                    distractProcentParag.style.display = 'block';
                    distractProcentParag.style.color = '#a80000';

                    setTimeout(() => {
                        distractProcentParag.style.display = 'none';
                    }, 3000);
                }
            }

            LocalStack.push('firstDateStack', Storage.items.firstDate.value);
            LocalStack.push('secondDateStack', Storage.items.secondDate.value);

        } else {
            countpassWrapper.style.display = 'none';
            countpassErrorMsg.style.display = 'block';
            countpassDiv.style.border = '1px solid #a80000';
            countpassErrorMsg.innerHTML = 'Range is bigger than 8 hours';

            setTimeout(() => {
                countpassErrorMsg.style.display = 'none';
                countpassDiv.style.border = 'none';
                countpassWrapper.style.display = 'flex';
            }, 2000)
        }
    } else if (Storage.items.firstDate.value && !Storage.items.secondDate.value) {
        countpassWrapper.style.display = 'none';
        countpassErrorMsg.style.display = 'block';
        countpassDiv.style.border = '1px solid #a80000';
        countpassErrorMsg.innerHTML = 'Second date is missing';

        setTimeout(() => {
            countpassErrorMsg.style.display = 'none';
            countpassDiv.style.border = 'none';
            countpassWrapper.style.display = 'flex';
        }, 2000)
    } else if (!Storage.items.firstDate.value && Storage.items.secondDate.value) {
        countpassWrapper.style.display = 'none';
        countpassErrorMsg.style.display = 'block';
        countpassDiv.style.border = '1px solid #a80000';
        countpassErrorMsg.innerHTML = 'First date is missing';

        setTimeout(() => {
            countpassErrorMsg.style.display = 'none';
            countpassDiv.style.border = 'none';
            countpassWrapper.style.display = 'flex';
        }, 2000)
    } else {
        countpassWrapper.style.display = 'none';
        countpassErrorMsg.style.display = 'block';
        countpassDiv.style.border = '1px solid #a80000';
        countpassErrorMsg.innerHTML = 'No date present';

        setTimeout(() => {
            countpassErrorMsg.style.display = 'none';
            countpassDiv.style.border = 'none';
            countpassWrapper.style.display = 'flex';
        }, 2000)
    }
}
