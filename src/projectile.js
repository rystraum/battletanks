import Phaser from 'phaser';

export default class Projectile extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, 42 );
    }

    speed = Phaser.Math.GetSpeed(400, 1);

    facing = 'up';
    fire = (x, y, facing) => {
        this.facing = facing;
        switch (facing) {
            case 'up':
                this.setPosition(x, y - 16);
                break;
            case 'down':
                this.setPosition(x, y + 16);
                break;
            case 'left':
                this.setPosition(x - 16, y);
                break;
            case 'right':
                this.setPosition(x + 16, y);
                break;
            default:
                this.setPosition(x, y - 16);
                break;
        }
        this.setActive(true);
        this.setVisible(true);
    };

    update = (time, delta) => {
        switch (this.facing) {
            case 'up':
                this.y -= this.speed * delta;
                break;
            case 'down':
                this.y += this.speed * delta;
                break;
            case 'left':
                this.x -= this.speed * delta;
                break;
            case 'right':
                this.x += this.speed * delta;
                break;
            default:
                break;
        }

        if ((this.y || this.x) < -16) {
            this.setActive(false);
            this.setVisible(false);
        }
    };
}
