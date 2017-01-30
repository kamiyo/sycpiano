import { max } from 'lodash';
import randomColor from 'randomColor';
import ConstantQ from '@/js/components/Media/Music/ConstantQ.js';
import math from 'mathjs';

function randomFloat (min, max) {
	return min + Math.random()*(max-min);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export class ParticleExplosionsManager {
    constructor(context2D) {
        this._explosions = [];
        this._context = context2D;
    }

    update(deltaMs) {
        // update each explosion and only keep the ones that are still visible
        this._explosions = this._explosions.filter(e => {
            e.update(deltaMs);
            e.draw(this._context);
            return e.isVisible;
        });
    }

    createExplosion(x, y, particleSizes) {
        this._explosions.push(new ParticleExplosion(x, y, particleSizes));
    }

    get count() {
        return this._explosions.length;
    }
}

export class ParticleExplosion {
    constructor(x, y, particleSizes) {
        this._particles = [];

        const numParticles = particleSizes.length;
        const minSize = 25;
        const maxSize = 60;
        const minSpeed = 300.0;
        const maxSpeed = 500.0;
        const minScaleSpeed = 2.0;
        const maxScaleSpeed = 3.0;

        const twoPi = 2 * Math.PI;
        const maxParticleSize = max(particleSizes);

        let color = randomColor({
            luminosity: 'bright',
            format: 'rgbArray' // e.g. '[225,200,20]'
        });
        color = `rgba(${[...color, 0.6].join(',')})`;

        // creating 4 particles that scatter at 0, 90, 180 and 270 degrees
        for (let i = 0; i < numParticles; i++) {
            if (particleSizes[i] < 40) continue;
            const particle = new Particle();

            // particle will start explosion at center
            particle.x = x;
            particle.y = y;
            // particle.radius = randomFloat(minSize, maxSize);
            particle.radius = particleSizes[i];

            // particle.color = getRandomColor();

            particle.color = color;

            particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);

            const speed = randomFloat(minSpeed, maxSpeed);
            
            // velocity is rotated by 'angle'
            const angle = i * twoPi / numParticles
            particle.velocityX = speed * Math.cos(angle);
            particle.velocityY = speed * Math.sin(angle);

            // adding the newly created particle to the 'particles' array
            this._particles.push(particle);
        }
    }

    update(deltaMs) {
        this._particles.forEach(p => p.update(deltaMs));
    }

    draw(context2D) {
        this._particles.forEach(p => p.draw(context2D));
    }

    get isVisible() {
        // explosion is considered visible if any particle is visible
        return !!this._particles.find(p => p.isVisible);
    }

    get particles() {
        return this._particles;
    }
}

export class Particle {
    constructor() {
        this.scale = 1.0;
        this.x = 0;
        this.y = 0;
        this.radius = 100;
        this.color = '#000';
        this.velocityX = 0;
        this.velocityY = 0;
        this.scaleSpeed = 0.8;
    }

    get isVisible() {
        return this.scale > 0;
    }

    update(ms) {
        // shrinking
        this.scale -= this.scaleSpeed * ms / 1000.0;

        if (this.scale <= 0) {
            this.scale = 0;
        }

        // moving away from explosion center
        this.x += this.velocityX * ms / 1000.0;
        this.y += this.velocityY * ms / 1000.0;
    }

    draw(context2D) {
        // translating the 2D context to the particle coordinates
        context2D.save();
        context2D.translate(this.x, this.y);
		context2D.scale(this.scale, this.scale);

		// drawing a filled circle in the particle's local space
		context2D.beginPath();
		context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
		context2D.closePath();

		context2D.fillStyle = this.color;
		context2D.fill();

		context2D.restore();
    }
}