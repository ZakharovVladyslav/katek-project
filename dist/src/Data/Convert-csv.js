export default function CsvToArray(str, delimiter = ',') {
    if (!str.includes('#') || (str.indexOf('ProdCode') - 2 !== str.indexOf('#')))
        str = '#,' + str;
    const filters = str.slice(0, str.indexOf('#'));
    let headers = str.slice(str.indexOf('#') + 2, str.indexOf('\n')).split(delimiter);
    let rows = str.slice(str.indexOf("\n")).split("\n");
    const arr = rows.map((row) => {
        const values = row.split(delimiter);
        const element = headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
        }, {});
        return element;
    });
    str = '';
    rows = null;
    return arr;
}
