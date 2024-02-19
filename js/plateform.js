import * as THREE from 'three';

class Platform extends THREE.Mesh {
    constructor({
        size = { w: 1, h: 1, d: 1 },
        color = '#F00000',
        velocity = new THREE.Vector3(),
        position = { x: 0, y: 0, z: 0 }
    }) {
        super(
            new THREE.BoxGeometry(size.w, size.h, size.d),
            new THREE.MeshStandardMaterial({ color })
        );
        this.size = size;
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

        // 1: Poid nul (rebonds infini)
        // 0: Poid infini (aucun rebonds)
        this.weight = 0.2;
    }

    update(ground) {
        this.updateSides();

        this.applyGravity(ground);
        updateVelocity();
        this.move();
    }
    updateSides() {
        this.sidesBox = {
            right: this.position.x + this.size.w / 2,
            left: this.position.x - this.size.w / 2,
            front: this.position.z + this.size.d / 2,
            back: this.position.z - this.size.d / 2,
            bottom: this.position.y - this.size.h / 2,
            top: this.position.y + this.size.h / 2
        };
    }
    applyGravity() {
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
            const tempsEcoule = new Date() - startTimer;
            console.log(`Le temps écoulé est de ${tempsEcoule} millisecondes.`);

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

export default Platform;