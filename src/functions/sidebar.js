export default function sideBarToggle(panel, input, label) {
    label.style.opacity = '1'
    label.style.transition = 'opacity ease 0.3s'

    input.onchange = () => {
        if (input.checked) {
            panel.style.width = '400px'
            panel.style.borderRight = '1px solid #00ffff'
            label.style.marginLeft = '400px'
            label.style.transform = 'rotate(360deg)'
            label.style.transition = '0.5s ease-in-out'
        } else {
            panel.style.width = '0px'

            setTimeout(() => panel.style.borderRight = '0px', 500)
            label.style.transform = 'rotate(-360deg)'
            label.style.marginLeft = '0px'
        }
    }
}