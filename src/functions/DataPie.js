import Controller from "./Controller.js"

export default function DataPie() {
    const dataPieInput = document.querySelector("#pie-diagramm-checkbox");
    const svgElem = document.querySelector('#svg-element');
    const labels = document.querySelector('#labels');
    const diagrammLabel = document.querySelector('#pie-diagramm-label');
    const svgDiv = document.querySelector('#svg-div');
    const diagrammDescriptionLabel = document.querySelector('#diagramm-description');

    diagrammLabel.addEventListener('click', () => {
        svgDiv.style.display = 'flex';
    })

    dataPieInput.addEventListener('change', () => {
        diagrammDescriptionLabel.style.display = 'block';
        svgElem.style.display = 'block';
        svgDiv.style.display = 'flex';
        labels.innerHTML = '';

        const keys = ['CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

        const values = Controller.instance.core.changableArray.map(object => {
            const objectValues = [];

            keys.forEach(key => {
                objectValues.push(object[key]);
            })

            return objectValues;
        })

        let zeros = [0, 0, 0, 0];

        for (let i = 0; i < values.length; i++)
            for (let j = 0; j < values[i].length; j++)
                if (values[i][j] !== undefined && values[i][j] != 0)
                    zeros[j] += parseFloat(values[i][j]);

        const data = [
            { label: "CountPass", value: zeros[0], color: "#00FF00", stroke: "#396E28" },
            { label: "CountFail", value: zeros[1], color: "#FF0000", stroke: "#900606" },
            { label: "CountPass_Retest", value: zeros[2], color: "#C47A00", stroke: "#877E00" },
            { label: "CountFail_Retest", value: zeros[3], color: "#00FFEC", stroke: "#041A4C" },
        ];

        if (!dataPieInput.checked) {
            const radius = 150;

            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            const pieGenerator = d3.pie()
                .value(function (d) {
                    return d.value;
                });

            const svg = d3.select("svg");

            const center = { x: 200, y: 200 };

            const circleDiagram = svg.append("g")
                .attr("transform", "translate(" + center.x + "," + center.y + ")");

            const arcs = circleDiagram.selectAll("arc")
                .data(pieGenerator(data))
                .enter()
                .append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", arcGenerator)
                .style("fill", function (d) {
                    return d.data.color;
                })
                .style("stroke", '#000000')
                .style("stroke-width", "1px")

            const blackCircle = circleDiagram.append("circle")
                .attr("r", radius / 1.5)
                .style("fill", "#313038")
                .style('stroke', 'black')
                .style('stroke-width', "1px")
                .raise();

            data.forEach((elem, index) => {
                const html = `
                        <div id='color-${index + 1}' style="display: flex; flex-direction: row; gap: 10px;">
                            <span id='square' style="width: 40px; height: 40px; background-color: ${elem.color}; display: block; "></span>
                            <p>${elem.label} - ${elem.value}</p>
                        </div>
                `;

                labels.insertAdjacentHTML('beforeend', html);
            });
        }
        else {
            svgDiv.style.display = 'none';
            svgElem.style.display = 'none';
            labels.innerHTML = '';
            diagrammDescriptionLabel.style.display = 'none';
        }
    })
}