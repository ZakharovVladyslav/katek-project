const svgDiv = document.querySelector('#svg-div') as HTMLDivElement;

export default function handleDiagramClick() {
    svgDiv.getAttribute('style') === 'display: none;'
    ? svgDiv.style.display = 'flex'
    : svgDiv.style.display = 'none';
}
