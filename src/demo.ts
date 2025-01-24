import { Camera } from "@babylonjs/core/Cameras/camera"
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { GroundMesh } from "@babylonjs/core/Meshes/groundMesh"
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder"
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { Texture } from "@babylonjs/core/Materials/Textures/texture"
import { Tools } from "@babylonjs/core/Misc/tools"
import { HavokPlugin } from "@babylonjs/core/Physics"
import "@babylonjs/core/Helpers/sceneHelpers" // required by: scene.createDefaultCameraOrLight()
import { Scene } from "@babylonjs/core/scene"
import { Nullable } from "@babylonjs/core/types"
import { Button } from "@babylonjs/gui/2D/controls/button"
import { Image } from "@babylonjs/gui/2D/controls/image"
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture"
import { Color3 } from "@babylonjs/core/Maths/math.color"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import HavokPhysics from "@babylonjs/havok"
// local imports
import { createLilGui, enableDebug, LilGui } from "./basic"
// assets
import ground_jpg from "/textures/ground.jpg?url"
import typescript_svg from "/svgs/typescript.svg?url"
import vite_svg from '/svgs/vite.svg?url'

export class DemoApp {
    canvas: HTMLCanvasElement
    engine: Engine
    scene: Scene
    gui?: LilGui

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.engine = new Engine(canvas, true)
        this.engine.enableOfflineSupport = true
        this.scene = new Scene(this.engine, {})
        this.scene.collisionsEnabled = true
    }

    async run() {
        this.scene.createDefaultCameraOrLight(true, true, true)
        const camera = this.scene.activeCamera as ArcRotateCamera
        camera.alpha = Tools.ToRadians(0)
        camera.beta = Tools.ToRadians(0)
        camera.radius = 20
        camera.fov = Tools.ToRadians(110)
        // this.scene.createDefaultEnvironment()
        this.scene.createDefaultSkybox(undefined, false, 2)
        this.setupGround()
        this.setupPhysics()
        this.setupUI()
        this.setupMeshes()
        this.setupDebug(this.scene.activeCamera)
    }

    setupGround(): GroundMesh {
        const ground: GroundMesh = MeshBuilder.CreateGround("ground", {width: 36, height: 36, subdivisions: 2}, this.scene)
        ground.checkCollisions = true
        const groundMaterial = new StandardMaterial("groundMaterial", this.scene)
        groundMaterial.diffuseTexture = new Texture(ground_jpg, this.scene)
        groundMaterial.diffuseTexture.scale(2)
        groundMaterial.diffuseColor = new Color3(1, 1, 1) // RGB for a white color
        ground.material = groundMaterial
        return ground
    }

    async setupPhysics() {
        const havokInstance = await HavokPhysics()
        const physicsPlugin = new HavokPlugin(true, havokInstance)
        const gravity = new Vector3(0, -9.8, 0)
        this.scene.enablePhysics(gravity, physicsPlugin)
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.engine.runRenderLoop(this.renderLoop.bind(this))
    }

    setupUI(): AdvancedDynamicTexture {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI")

        const button1 = Button.CreateImageOnlyButton("button1", typescript_svg)
        if (button1.image) {
            button1.image.stretch = Image.STRETCH_UNIFORM
        }
        button1.width = "64px"
        button1.height = "64px"
        button1.color = "transparent"
        button1.delegatePickingToChildren = true
        button1.onPointerUpObservable.add(() => {
            button1.isVisible = false
            button2.isVisible = true
        })
        button1.horizontalAlignment = Image.HORIZONTAL_ALIGNMENT_CENTER
        button1.verticalAlignment = Image.VERTICAL_ALIGNMENT_TOP
        ui.addControl(button1)

        const button2 = Button.CreateImageOnlyButton("button2", vite_svg)
        if (button2.image) {
            button2.image.stretch = Image.STRETCH_UNIFORM
        }
        button2.isVisible = false
        button2.width = "64px"
        button2.height = "64px"
        button2.color = "transparent"
        button2.delegatePickingToChildren = true
        button2.onPointerUpObservable.add(() => {
            button2.isVisible = false
            button1.isVisible = true
        })
        button2.horizontalAlignment = Image.HORIZONTAL_ALIGNMENT_CENTER
        button2.verticalAlignment = Image.VERTICAL_ALIGNMENT_TOP
        ui.addControl(button2)

        return ui
    }

    setupMeshes() {
        var sphere = MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, this.scene)
        sphere.position = new Vector3(1, 6, 8)
        sphere.scaling = new Vector3(2, 2, 2)
    }

    setupDebug(camera: Nullable<Camera>) {
        const gui = createLilGui()
        enableDebug(this.scene, gui, camera, true)
        this.gui = gui
    }

    onWindowResize() {
        this.engine.resize()
    }

    renderLoop() {
        this.scene.render()
    }
}

export default async function setupDemo(canvas: HTMLCanvasElement) {
    const demo = new DemoApp(canvas)
    await demo.run()
}
