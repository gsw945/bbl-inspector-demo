import setupDemo from './demo'

export function setupBabylon(canvas: HTMLCanvasElement) {
    canvas.style.width = "100%"
    canvas.style.height = "auto"
    setupDemo(canvas)
}
