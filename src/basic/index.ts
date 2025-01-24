import { Camera } from "@babylonjs/core/Cameras/camera"
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"

import { GUI as LilGui } from "lil-gui"
import { Draggable } from "@neodrag/vanilla"
import screenfull from "screenfull"
import Notify from "simple-notify"
import "simple-notify/dist/simple-notify.css"

export { LilGui }

export function createLilGui(guiId: string = "dataGUI"): LilGui {
    const gui = new LilGui()
    var oldGui = document.getElementById(guiId)
    if (oldGui) {
        oldGui.remove()
    }
    gui.domElement.id = guiId
    const dragger = document.createElement("div")
    dragger.className = "dragger"
    dragger.style.display = "inline-block"
    dragger.style.position = "absolute"
    dragger.style.right = "0"
    dragger.style.top = "0"
    dragger.style.width = "100px"
    dragger.style.textAlign = "center"
    dragger.style.border = "1px solid #999"
    dragger.style.cursor = "move"
    dragger.innerText = "MOVE"
    gui.domElement.appendChild(dragger)
    const guiTitle = gui.domElement.querySelector(".title") as HTMLDivElement
    const titleHeight = guiTitle.offsetHeight
    dragger.style.height = `${titleHeight}px`
    dragger.style.lineHeight = `${titleHeight}px`
    const dragInstance = new Draggable(gui.domElement, {
        axis: "both",
        bounds: { top: 10, left: 10, bottom: 10, right: 10 },
        legacyTranslate: true,
        gpuAcceleration: true,
        applyUserSelectHack: true,
        ignoreMultitouch: false,
    })
    dragInstance.updateOptions({
        defaultPosition: { x: 100, y: 100 },
        handle: dragger,
    })
    gui.domElement.style.transform = "translate3d(5px, 10px, 0px)"
    gui.close()
    return gui
}

export function enableDebug(scene: Scene, gui: LilGui, camera: Nullable<Camera>, enableFullscreen: boolean = false) {
    const folder = gui.addFolder("Debug")
    const isDebugEnable = () => {
        if (scene.debugLayer) {
            return scene.debugLayer.isVisible()
        }
        return false
    }
    const onDebugChange = (value: boolean) => {
        if (value) {
            scene.debugLayer.show({
                overlay: true,
                showExplorer: true,
                showInspector: true,
                embedMode: false,
                handleResize: true,
                enablePopup: true,
                enableClose: true,
                gizmoCamera: camera as Camera,
            })
            const sceneExplorer = document.getElementById("scene-explorer-host")
            if (sceneExplorer) {
                sceneExplorer.style.zIndex = "101"
            }
            const inspector = document.getElementById("inspector-host")
            if (inspector) {
                inspector.style.zIndex = "101"
            }
        } else {
            scene.debugLayer.hide()
        }
    }
    let isDebugLoaded = false
    folder.add({ "enable": isDebugEnable() }, "enable").onChange((value: boolean) => {
        if (isDebugLoaded) {
            onDebugChange(value)
            return
        }
        import("./debug.ts").then(() => {
            isDebugLoaded = true
            onDebugChange(value)
        }).catch(err => {
            console.warn(err)
        })
    })
    if (enableFullscreen) {
        setupFullscreen(folder)
    }
}

export function setupFullscreen(gui: LilGui) {
    const fsToggle = gui.add({ "toggle": false }, "toggle").name("fullscreen")
    let fsSkipEvent = false
    fsToggle.onChange(() => {
        if (fsSkipEvent) {
            fsSkipEvent = false
            return
        }
        if (screenfull.isEnabled) {
            screenfull.toggle(document.body, {navigationUI: 'hide'})
        } else {
            pushNotify("FullScreen is not enabled")
        }
    })
    screenfull.on('change', () => {
        fsSkipEvent = true
        fsToggle.setValue(screenfull.isFullscreen)
        setTimeout(() => {
            fsSkipEvent = false
        }, 80)
    })
}

export function pushNotify(text: string): Notify {
    return new Notify({
        status: 'info',
        title: undefined,
        text: text,
        effect: 'fade',
        speed: 300,
        customClass: undefined,
        customIcon: undefined,
        showIcon: true,
        showCloseButton: false,
        autoclose: true,
        autotimeout: 2000,
        notificationsGap: 20,
        notificationsPadding: 20,
        type: 'outline',
        position: 'top x-center'
    })
}
