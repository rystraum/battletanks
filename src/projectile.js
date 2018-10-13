import Phaser from 'phaser';

export default class Projectile extends Phaser.GameObjects.Image {
    constructor(config) {
        super(config.scene, 0, 0, config.key, 42 );
        this.boundingBox = config.boundingBox;
    }

    boundingBox = null;
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

        if (this.x < 0
            || this.y < 0
            || this.x > this.boundingBox.gameWidth
            || this.y > this.boundingBox.gameHeight
        ) {
            this.setActive(false);
            this.setVisible(false);
        }
    };
}
