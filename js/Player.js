import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { GLTFLoader } from 'https://cdn.jsdlivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';

const Espsilon = 0.01;
const gravity = 0.01;
let jumpVelocity = 0.05;
const maxJumpHeight = 2;
let isJumping = false;
let jumpStart = -1;

class Player extends THREE.Mesh {
    constructor({
        velocity = new THREE.Vector3(),
        position = { x: 0, y: 0, z: 0 }
    }) {
        super();

        this.texture = new THREE.TextureLoader().load('modele/piston.glb');

        new GLTFLoader().load('modele/piston.glb', (gltf) => {
            const geometry = gltf.scene.children[0].geometry;
            const material = new THREE.MeshStandardMaterial({ map: this.texture });
            const mesh = new THREE.Mesh(geometry, material);
            this.add(mesh);
        });

        // Définissez this.size en fonction de vos besoins
        this.size = { w: 1, h: 1, d: 1 };

        this.position.set(position.x, position.y, position.z);

        this.sidesBox = {
            right: this.position.x + this.size.w / 2,
            left: this.position.x - this.size.w / 2,
            front: this.position.z + this.size.d / 2,
            back: this.position.z - this.size.d / 2,
            bottom: this.position.y - this.size.h / 2,
            top: this.position.y + this.size.h / 2
        };

        this.velocity = velocity;
        this.weight = 0.2;
    }
    update(ground, isFalling, keys) {
        this.updateSides();

        this.applyGravity(ground, isFalling);
        updateVelocity(this, keys);
        this.move();
    }
    updateSides() {
        // TODO Changer les size en fonction des dimensions max de l'entité
        this.sidesBox = {
            right: this.position.x + this.size.w / 2,
            left: this.position.x - this.size.w / 2,
            front: this.position.z + this.size.d / 2,
            back: this.position.z - this.size.d / 2,
            bottom: this.position.y - this.size.h / 2,
            top: this.position.y + this.size.h / 2
        };
    }
    applyGravity(ground, isFalling) {
        if (this.position.y - jumpStart >= maxJumpHeight) {
            isJumping = false;
            isFalling = true;
            jumpVelocity = 0.05;
        }
        if (isJumping) {
            this.velocity.y += jumpVelocity;
            jumpVelocity *= 0.5;

            if (jumpStart == -1) {
                jumpStart = this.position.y;
            } else if (this.position.y <= jumpStart) { // ! Besoin potentiel d' = 0.01;.
                jumpStart = -1;
            }
        } else {
            this.velocity.y -= gravity;
        }
        this.position.y += this.velocity.y;
    
        // Vérifiez si this a atteint le sol (ajustez cela en fonction de votre scène)
        if (this.position.y - Espsilon < ground.sidesBox.top + this.size.h / 2) {
            this.position.y = ground.sidesBox.top + this.size.h / 2;
            this.velocity.y = 0;
            isFalling = false;

        }
    }
    
    move() {
        this.position.z += this.velocity.z;
        this.position.x += this.velocity.x;
    }
}

// TODO Normaliser le vecteur.
function updateVelocity(player, keys) {
    const speed = 0.05;

    player.velocity.x = (keys['q']?.pressed ? -1 : 0) + (keys['d']?.pressed ? 1 : 0);
    player.velocity.z = (keys['z']?.pressed ? -1 : 0) + (keys['s']?.pressed ? 1 : 0);

    player.velocity.x *= speed;
    player.velocity.z *= speed;
}

export default Player;