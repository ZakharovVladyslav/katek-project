export default function CsvToArray(str: string, delimiter = ','): object[] {
	if (!str.includes('#') || (str.indexOf('ProdCode') - 2 !== str.indexOf('#')))
		str = '#,' + str;

	const headers = str.slice(str.indexOf('#') + 2, str.indexOf('\n')).split(delimiter);
	let rows = str.slice(str.indexOf('\n')).split('\n');

	const arr = rows.map((row) => {
		const values = row.split(delimiter);
		const element: { [key: string]: string } = headers.reduce((object, header, index) => {
			object[header] = values[index];
			return object;
		}, {});
		return element;
	});

	str = '';
	rows = null;

	return arr;
}
