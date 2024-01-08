import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import Stats from 'three/examples/jsm/libs/stats.module'
import textureVertex from './shader/texture/vertex.glsl'
import textureFragment from './shader/texture/fragment.glsl'
import vertexSun from './shader/sun/vertex.glsl'
import fragmentSun from './shader/sun/fragment.glsl'
import vertexAround from './shader/around/vertex.glsl'
import fragmentAround from './shader/around/fragment.glsl'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const params = {
    timeScale: 0.005,
    am: .9,
    fm: 2.,
    offset: 100,
    itr: 6
}

gui.add(params, 'timeScale').min(0).max(2).step(0.001).name('时间频率').onChange(()=>sun.material.uniforms.uTimeScale.value = params.timeScale)
gui.add(params, 'am').min(0).max(2).step(0.001).name('调幅倍率').onChange(()=>perlin.material.uniforms.uAm.value = params.am)
gui.add(params, 'fm').min(0).max(10).step(0.01).name('调频倍率').onChange(()=>perlin.material.uniforms.uFm.value = params.fm)
gui.add(params, 'offset').min(0).max(1000).step(0.1).name('时间偏移').onChange(()=>perlin.material.uniforms.uOffset.value = params.offset)
gui.add(params, 'itr').min(1).max(10).step(1).name('叠加次数').onChange(()=>perlin.material.uniforms.uItr.value = params.itr)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const scene1 = new THREE.Scene()
/* 
Light
*/
const ambientLight = new THREE.AmbientLight('white', 0.6)
scene.add(ambientLight)

const dirctionLight = new THREE.DirectionalLight('white', 1)
scene.add(dirctionLight)


const stats = new Stats()
document.body.appendChild(stats.dom)

/* 
RenderTarget
*/
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    colorSpace: THREE.SRGBColorSpace
})
const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget)


// texture Mesh
const initTex = () => {
    const textureGeometry = new THREE.SphereGeometry(1, 30, 30)
    const shaderTextureMaterial = new THREE.ShaderMaterial({
        vertexShader: textureVertex,
        fragmentShader: textureFragment,
        side: THREE.DoubleSide,
        uniforms: {
            uTime: { value: 0 },
            uAm: { value: params.am },
            uFm: { value: params.fm },
            uOffset:{value:params.offset},
            uItr: { value: params.itr }
        },
    })
    const mesh = new THREE.Mesh(textureGeometry, shaderTextureMaterial)
    scene1.add(mesh)
    return mesh
}


// create Sun
const initSun = () => {
    const sungeometry = new THREE.SphereGeometry(1, 30, 30)
    const shaderSunMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexSun,
        fragmentShader: fragmentSun,
        uniforms: {
            uTime: { value: 0 },
            uTimeScale:{value:0},
            uPerlin: { value: null }
        },
    })
    const mesh = new THREE.Mesh(sungeometry, shaderSunMaterial)
    scene.add(mesh)

    return mesh
}

// create Around

const initAround = () => {
    const aroundGeo = new THREE.SphereGeometry(1.1, 30, 30)
    const shaderAroundMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexAround,
        fragmentShader: fragmentAround,
        side: THREE.BackSide,
        uniforms: {
            uTime: { value: 0 },
        },
        transparent: true
    })
    const around = new THREE.Mesh(aroundGeo, shaderAroundMaterial)
    scene.add(around)

    return around
}


const perlin = initTex()
const sun = initSun()
const around = initAround()


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    sun.scale.setScalar(sizes.width / sizes.height)
    around.scale.setScalar(sizes.width / sizes.height)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 0.5
controls.rotateSpeed = 0.1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setClearColor('black')
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace

/**
 * Animate
 */
const clock = new THREE.Clock()


console.log('perlin.material', perlin.material)

const tick = () => {
    // mesh.lookAt(camera.position)

    stats.update()

    const elapsedTime = clock.getElapsedTime()

    cubeCamera.update(renderer, scene1)

    perlin.material.uniforms.uTime.value = elapsedTime
    sun.material.uniforms.uPerlin.value = cubeRenderTarget.texture
    sun.material.uniforms.uTime.value = elapsedTime

    around.lookAt(camera.position)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()