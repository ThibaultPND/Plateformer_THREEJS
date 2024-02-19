import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Platform from './plateform';
import Player from './Player';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const Espsilon = 0.01;
let isFalling = false;

let startTimer;

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


const player = new Player({
    velocity: new THREE.Vector3(0, -0.2, 0)
});
player.castShadow = true;
scene.add(player);

const ground = new Platform({
    size: { w: 100, h: 0.5, d: 100 },
    position: { x: 0, y: -2.5, z: 0 },
    color: '#DDDDDD'
});
ground.receiveShadow = true;
scene.add(ground);


const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(0, 4, 5);
light.castShadow = true;
scene.add(light);

const sun = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(sun);

camera.position.z = 5;

const keys = {
    'z': { pressed: false },
    's': { pressed: false },
    'q': { pressed: false },
    'd': { pressed: false },
    ' ': { pressed: false }
};
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keys[key] !== undefined) {
        keys[key].pressed = true;
    }
    if (key == ' '  && !isFalling){
        isJumping = true;
        startTimer = new Date();
    }
});
window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keys[key] !== undefined) {
        keys[key].pressed = false;
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    player.update(ground, isFalling, keys);
}
animate();