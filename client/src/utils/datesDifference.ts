export default function getDateDiffHours(date1: string, date2: string): number {

    const newDate1 = new Date(date1);
    const newDate2 = new Date(date2);

    // Convert to timestamps
    const time1 = newDate1.getTime();
    const time2 = newDate2.getTime();

    // Calculate difference in milliseconds
    let diffMs = time1 - time2;

    // Handle swap where date2 is later
    if (diffMs < 0) {
        diffMs = time2 - time1;
    }

    // Convert to hours and return
    //const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffHours: number = diffMs / (1000 * 60 * 60);

    return diffHours;
}
