import Phaser from 'phaser';
import sky from './assets/sky.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';
import floors from './assets/DawnLike/Objects/Floor.png';
import warrior from './assets/DawnLike/Commissions/Warrior.png';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
},
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.image('tilemap-floors', floors);
    this.load.spritesheet('dude', warrior, {
        frameWidth: 16,
        frameHeight: 16,
    });
}

var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var bombs;
var gameOver = false;

function setupPlatforms(platforms) {
    platforms
        .create(400, 588, 'ground')
        .setScale(2, 1)
        .refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
}

function setupPlayer(player) {
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    player.data = {
        isFalling: false,
    };
}

function setupPlayerAnimations(anims) {
    anims.create({
        key: 'left',
        frames: anims.generateFrameNumbers('dude', { frames: [5, 4] }),
        frameRate: 10,
        repeat: -1,
    });

    anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 0 }],
        frameRate: 20,
    });

    anims.create({
        key: 'right',
        frames: anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1,
    });

    anims.create({
        key: 'down',
        frames: anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
    });

    anims.create({
        key: 'up',
        frames: anims.generateFrameNumbers('dude', { start: 12, end: 15 }),
        frameRate: 10,
        repeat: -1,
    });
}

function setupStars(stars) {
    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0, 0.4));
    });
}

function create() {
        var map      = this.make.tilemap({ key: 'map' });
        var tileset  = map.addTilesetImage('Floor', 'tilemap-floors');
        var mapLayer = map.createStaticLayer("World", tileset, 0, 0);
        var boxLayer = map.createDynamicLayer("Above World", tileset, 0, 0);


    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '16px',
        fill: '#fff',
    });
    player = this.physics.add.sprite(100, 450, 'dude');


    setupPlayer(player);
    setupPlayerAnimations(this.anims);

    this.cameras.main.setBounds(0, 0, 800 * 2, 768 * 2);
    this.cameras.main.startFollow(player, true, 1, 1);
    this.cameras.main.zoom = 2;
}

function update(time, delta) {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();
    player.body.setVelocity(0);
    if (cursors.left.isDown) {
        player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(speed);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(speed);
    }

    player.body.velocity.normalize().scale(speed);

    if (cursors.left.isDown) {
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.anims.play('right', true);
    } else if (cursors.up.isDown) {
        player.anims.play('up', true);
    } else if (cursors.down.isDown) {
        player.anims.play('down', true);
    } else {
        player.anims.stop();
    }
}