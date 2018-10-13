import Phaser from 'phaser';
import Projectile from './projectile';
import floors from './assets/DawnLike/Objects/Floor.png';
import warrior from './assets/DawnLike/Commissions/Warrior.png';
import ammo from './assets/DawnLike/Items/Ammo.png';
import mapjson from './assets/map.json';

const config = {
    type: Phaser.AUTO,
    width: 1600,
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

const game = new Phaser.Game(config);

function preload() {
    this.load.image('tilemap-floors', floors);
    this.load.tilemapTiledJSON('map', mapjson);
    this.load.spritesheet('dude', warrior, {
        frameWidth: 16,
        frameHeight: 16,
    });
    this.load.spritesheet('projectile', ammo, {
        frameWidth: 16,
        frameHeight: 16,
    });
}

let player;
let cursors;
let bullets;
let fireButton;
let lastFired = 0;
let gameOver = false;

function setupPlayer(player) {
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    player.data = {
        isFalling: false,
        facing: 'up'
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
    const map      = this.make.tilemap({ key: 'map' });
    const tileset  = map.addTilesetImage('Floor', 'tilemap-floors');
    const mapLayer = map.createStaticLayer("World", tileset, 0, 0);
    const boxLayer = map.createDynamicLayer("Above World", tileset, 0, 0);
    fireButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    boxLayer.setCollisionByProperty({ collides: true });

    /* Debug
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    boxLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });
    */

    bullets = this.add.group({
        classType: (s) => new Projectile({scene: s, key: 'projectile', x: 0, y: 96}),
        maxSize: 10,
        runChildUpdate: true
    });
    cursors = this.input.keyboard.createCursorKeys();
    player  = this.physics.add.sprite(100, 450, 'dude');

    setupPlayer(player);
    setupPlayerAnimations(this.anims);

    this.physics.add.collider(player, boxLayer);

    this.cameras.main.setBounds(0, 0, 800 * 2, 768 * 2);
    this.cameras.main.startFollow(player, true, 1, 1);
    this.cameras.main.zoom = 2;
}

function update(time, delta) {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
        player.data.facing = 'left';
    } else if (cursors.right.isDown) {
        player.data.facing = 'right';
    } else if (cursors.up.isDown) {
        player.data.facing = 'up';
    } else if (cursors.down.isDown) {
        player.data.facing = 'down';
    }

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



    if (fireButton.isDown && time > lastFired) {
        var bullet = bullets.get();
        if (bullet) {
            bullet.fire(player.x, player.y, player.data.facing);
            lastFired = time + 100;
        }
    }
}
