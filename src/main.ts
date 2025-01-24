import { setupBabylon } from './app.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = '<canvas id="babylon">your browser does not support canvas</canvas>'

setupBabylon(document.querySelector<HTMLCanvasElement>('#babylon')!)
