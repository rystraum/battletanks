import Phaser from 'phaser';
import floors from './assets/DawnLike/Objects/Floor.png';
import warrior from './assets/DawnLike/Commissions/Warrior.png';
import mapjson from './assets/map.json';

var gameWidth = 1600;
var gameHeight = 768;
var viewPortWidth = gameWidth / 2;
var viewPortHeight = gameHeight;

var config = {
    type: Phaser.AUTO,
    width: viewPortWidth,
    height: viewPortHeight,
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
    this.load.image('tilemap-floors', floors);
    this.load.tilemapTiledJSON('map', mapjson);
    this.load.spritesheet('dude', warrior, {
        frameWidth: 16,
        frameHeight: 16,
    });
}

var player;
var cursors;
var gameOver = false;

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

function create() {
    var map      = this.make.tilemap({ key: 'map' });
    var tileset  = map.addTilesetImage('Floor', 'tilemap-floors');
    var mapLayer = map.createStaticLayer("World", tileset, 0, 0);
    var boxLayer = map.createDynamicLayer("Above World", tileset, 0, 0);
    boxLayer.setCollisionByProperty({ collides: true });

    /* Debug
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    boxLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    */

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.world.setBounds(0, 0, gameWidth, gameHeight, true, true, true, true);

    player  = this.physics.add.sprite(100, 450, 'dude');

    setupPlayer(player);
    setupPlayerAnimations(this.anims);

    this.physics.add.collider(player, boxLayer);

    this.cameras.main.setBounds(0, 0, gameWidth, gameHeight);
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
