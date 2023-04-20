export default function DataPie() {
    const dataPieInput = document.querySelector("#pie-diagramm-checkbox")
    const svgElem = document.querySelector('#svg-element')
    const labels = document.querySelector('#labels')
    const svgDiv = document.querySelector('#svg-div')

    dataPieInput.addEventListener('change', () => {
        svgElem.style.display = 'block'

        const data = [
            { label: "CountPass", value: 2156, color: "#74e0d1" },
            { label: "CountFail", value: 281, color: "#00D4FF" },
            { label: "CountPass_Retest", value: 511, color: "#008FFF" },
            { label: "CountFail_Retest", value: 89, color: "#000CFF" },
        ];

        if (!dataPieInput.checked) {
            const radius = 150;

            const arcGenerator = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

            const pieGenerator = d3.pie()
                .value(function (d) { return d.value; });

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
                .style("fill", function (d) { return d.data.color; });

            data.forEach((elem, index) => {
                const html = `
                        <div id='color-${index + 1}' style="display: flex; flex-direction: row; gap: 10px;">
                            <span id='square' style="width: 40px; height: 40px; background-color: ${elem.color}; display: block; "></span>
                            <p>${elem.label} - ${elem.value}</p>
                        </div>
                    `

                labels.insertAdjacentHTML('beforeend', html)
            })
        }
        else {
            svgElem.style.display = 'none';
            labels.innerHTML = ''
        }
    })
}
