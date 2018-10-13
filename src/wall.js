import Phaser from 'phaser';

export default class Wall extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.sprite);
    }

    fire = (x, y, facing) => {

    };

    update = (time, delta) => {
    };
}
