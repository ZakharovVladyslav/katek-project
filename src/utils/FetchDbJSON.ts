export default async function fetchData(url: string) {
	console.log('FetchDbJSON()');
	const response = await fetch(url);
	const data: object[] = await response.json();

	return data;
}
