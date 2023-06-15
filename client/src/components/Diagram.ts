import CustomStorage from '../services/Storage/Local-Storage.js';
import * as d3 from 'd3';

const Storage = new CustomStorage();

interface Data {
	label: string;
	value: string;
	color: string;
	stroke: string;
}

export default function Diagram(): void {
	const dataPieInput: HTMLInputElement | null = document.querySelector('#pie-diagramm-checkbox');
	const svgElem = document.querySelector('#svg-element') as SVGElement;
	const labels: HTMLDivElement | null = document.querySelector('#labels');
	const diagrammLabel: HTMLLabelElement | null = document.querySelector('#pie-diagramm-label');
	const svgDiv: HTMLDivElement | null = document.querySelector('#svg-div');
	const diagrammDescriptionLabel: HTMLParagraphElement | null = document.querySelector('#diagramm-description');

	const diagrammLabelClick = () => {
		if (svgDiv) {
			svgDiv.style.display = 'flex';
		}
	};

	diagrammLabel?.addEventListener('click', diagrammLabelClick);

	const handleDataPieInputChange = () => {
		if (diagrammDescriptionLabel) {
			diagrammDescriptionLabel.style.display = 'block';
		}
		if (svgElem) {
			svgElem.style.display = 'block';
		}
		if (svgDiv) {
			svgDiv.style.display = 'flex';
		}
		if (labels) {
			labels.innerHTML = '';
		}

		const keys: string[] = ['CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

		const values: string[][] = Storage.items.data.map((object: { [key: string]: string }) => {
			const objectValues: string[] = [];

			keys.forEach((key: string) => {
				objectValues.push(object[key]);
			});

			return objectValues;
		});

		let zeros: Array<number | string> = [0, 0, 0, 0];

		for (let i = 0; i < values.length; i++) {
			for (let j = 0; j < values[i].length; j++) {
				if (values[i][j] !== undefined && values[i][j] !== '0') {
					zeros[j] = Number(zeros[j]) + parseFloat(values[i][j]);
				}
			}
		}

		zeros = zeros.map((zero: number | string) => {
			return typeof zero === 'number' ? zero.toFixed(2) : zero.toString();
		});

		const inputData: Data[] = [
			{ label: 'CountPass', value: zeros[0].toString(), color: '#20D300', stroke: '#396E28' },
			{ label: 'CountFail', value: zeros[1].toString(), color: '#D30000', stroke: '#900606' },
			{ label: 'CountPass_Retest', value: zeros[2].toString(), color: '#C47A00', stroke: '#877E00' },
			{ label: 'CountFail_Retest', value: zeros[3].toString(), color: '#00FFEC', stroke: '#041A4C' },
		];

		if (dataPieInput && !dataPieInput.checked) {
			const radius = 150;

			svgElem.innerHTML = '';

			const pieGenerator = d3
				.pie<Data>()
				.value((d) => parseFloat(d.value))
				.padAngle(0.03)
				.sort(null);

			const arcGenerator = d3
				.arc<d3.PieArcDatum<Data>>()
				.innerRadius(100)
				.outerRadius(radius);

			const pie = pieGenerator(inputData);

			const svg = d3
				.select(svgElem)
				.append('svg')
				.attr('width', radius * 2)
				.attr('height', radius * 2)
				.append('g')
				.attr('transform', `translate(${radius},${radius})`);

			svg
				.selectAll('path')
				.data(pie)
				.enter()
				.append('path')
				.attr('d', arcGenerator)
				.attr('fill', (d) => d.data.color)
				.attr('stroke', '#000000')
				.attr('stroke-width', 1);

			inputData.forEach((elem: Data, index: number) => {
				const html = `
					<div id='color-${index + 1}' style="display: flex; flex-direction: row; gap: 10px;">
						<span id='square' style="width: 40px; height: 40px; background-color: ${elem.color}; display: block; "></span>
						<p>${elem.label} - ${elem.value}</p>
					</div>
				`;

				if (labels) {
					labels.insertAdjacentHTML('beforeend', html);
				}
			});
		} else {
			if (svgDiv) {
				svgDiv.style.display = 'none';
			}
			if (svgElem) {
				svgElem.style.display = 'none';
			}
			if (labels) {
				labels.innerHTML = '';
			}
			if (svgElem) {
				svgElem.innerHTML = '';
			}
			if (diagrammDescriptionLabel) {
				diagrammDescriptionLabel.style.display = 'none';
			}
		}
	};

	dataPieInput?.addEventListener('click', handleDataPieInputChange);
}
