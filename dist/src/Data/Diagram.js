import CustomStorage from "../Storage/Local-Storage.js";
import * as d3 from 'd3';
const Storage = new CustomStorage();
export default function Diagram() {
    const dataPieInput = document.querySelector("#pie-diagramm-checkbox");
    const svgElem = document.querySelector('#svg-element');
    const labels = document.querySelector('#labels');
    const diagrammLabel = document.querySelector('#pie-diagramm-label');
    const svgDiv = document.querySelector('#svg-div');
    const diagrammDescriptionLabel = document.querySelector('#diagramm-description');
    diagrammLabel?.addEventListener('click', () => {
        if (svgDiv) {
            svgDiv.style.display = 'flex';
        }
    });
    diagrammLabel?.removeEventListener('click', () => { });
    dataPieInput?.addEventListener('change', () => {
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
        const keys = ['CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];
        const values = Storage.items.data.map((object) => {
            const objectValues = [];
            keys.forEach((key) => {
                objectValues.push(object[key]);
            });
            return objectValues;
        });
        let zeros = [0, 0, 0, 0];
        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values[i].length; j++) {
                if (values[i][j] !== undefined && values[i][j] !== '0') {
                    zeros[j] = Number(zeros[j]) + parseFloat(values[i][j]);
                }
            }
        }
        zeros = zeros.map((zero) => {
            return typeof zero === 'number'
                ? zero.toFixed(2)
                : zero.toString();
        });
        const inputData = [
            { label: "CountPass", value: zeros[0].toString(), color: "#20D300", stroke: "#396E28" },
            { label: "CountFail", value: zeros[1].toString(), color: "#D30000", stroke: "#900606" },
            { label: "CountPass_Retest", value: zeros[2].toString(), color: "#C47A00", stroke: "#877E00" },
            { label: "CountFail_Retest", value: zeros[3].toString(), color: "#00FFEC", stroke: "#041A4C" },
        ];
        if (dataPieInput && !dataPieInput.checked) {
            const radius = 150;
            const arcGenerator = d3.arc()
                .innerRadius(100)
                .outerRadius(radius)
                .padAngle(0.03);
            const pieGenerator = d3.pie()
                .value((d) => parseFloat(d.value))
                .padAngle(0.03);
            const svg = d3.select("svg");
            if (svgElem) {
                svgElem.innerHTML = '';
            }
            const center = { x: 200, y: 200 };
            const circleDiagram = svg.append("g")
                .attr("transform", `translate(${center.x},${center.y})`);
            const arcs = circleDiagram.selectAll("g.arc")
                .data(pieGenerator(inputData))
                .enter()
                .append("g")
                .attr("class", "arc");
            arcs.filter(d => d.value !== 0)
                .append("path")
                .attr("d", function (d) { return arcGenerator.call(this, d) || ''; }) // Use .call(this) to set the context
                .style("fill", (d) => d.data.color)
                .style('stroke', '#000000')
                .style('stroke-width', '1.35px');
            inputData.forEach((elem, index) => {
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
        }
        else {
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
    });
    dataPieInput?.removeEventListener('click', () => { });
}
