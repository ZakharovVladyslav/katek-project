export default async function handleDateInputSectionClick (e: MouseEvent) {
	const target = e.target as HTMLElement;

	if (target.id.substring(0, 6) === 'eraser') {
		const targetId: string = target.id.slice(7);

		const leftDate = document.querySelector('#left-date-inp') as HTMLInputElement;
		const rightDate = document.querySelector('#right-date-inp') as HTMLInputElement;

		parseInt(targetId) === 6
			? leftDate.value = ''
			: rightDate.value = '';
	}
};
