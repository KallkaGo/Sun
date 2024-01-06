import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'lil-gui'
import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'
import vertexShadersun from './shadersun/vertex.glsl'
import fragmentShadersun from './shadersun/fragment.glsl'
import vertexShaderAround from './shadersunAround/vertex.glsl'
import fragmentShaderAround from './shadersunAround/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

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


/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader()
const fbxLoader = new FBXLoader()
const gltfLoader = new GLTFLoader()
/**
 * Test mesh
 */
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)


// Geometry
const aroundGeo = new THREE.SphereGeometry(1.2, 30, 30)

const perlingeometry = new THREE.SphereGeometry(1, 30, 30)

const sungeometry = new THREE.SphereGeometry(1, 30, 30)


// Material
const material = new THREE.MeshBasicMaterial()

const shaderAroundMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShaderAround,
    fragmentShader: fragmentShaderAround,
    side: THREE.BackSide,
    uniforms: {
        uTime: { value: 0 },
        uPerlin: { value: null }
    },
    transparent:true
})

const shaderSunMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShadersun,
    fragmentShader: fragmentShadersun,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
        uPerlin: { value: null }
    },
})

const shaderPerlinMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 }
    },
    // transparent:true
})

const perlin = new THREE.Mesh(perlingeometry, shaderPerlinMaterial)
scene1.add(perlin)

// Mesh
const mesh = new THREE.Mesh(sungeometry, shaderSunMaterial)
scene.add(mesh)


const around = new THREE.Mesh(aroundGeo, shaderAroundMaterial)

scene.add(around)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

const tick = () => {
    // mesh.lookAt(camera.position)

    around.lookAt(camera.position)

    const elapsedTime = clock.getElapsedTime()

    cubeCamera.update(renderer, scene1)

    shaderSunMaterial.uniforms.uPerlin.value = cubeRenderTarget.texture

    shaderSunMaterial.uniforms.uTime.value = elapsedTime
    shaderPerlinMaterial.uniforms.uTime.value = elapsedTime
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()