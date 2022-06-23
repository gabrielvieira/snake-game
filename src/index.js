import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import {SnakeGameObject} from './objects/snake';

class SnakeGame extends Phaser.Scene
{
    constructor(config)
    {
        super(config);
        this.timer = 0;
    }

    preload ()
    {
        this.load.image('logo', logoImg);
    }
      
    create ()
    {
        this.snake = new SnakeGameObject(this)
        this.snake.add()
        // let r1 = this.add.rectangle(20, 200, 40, 40, 0x6666ff);
        // this.physics.add.existing(r1);
        // r1.body.velocity.x = 100;
        // r1.body.velocity.y = 0;
        // r1.body.bounce.x = 0;
        // r1.body.bounce.y = 0;
        // r1.body.collideWorldBounds = true;
    }

    update (time, delta)
    {
        let cursors = this.input.keyboard.createCursorKeys();
        this.timer += delta;
        while (this.timer > 100) {
            this.timer -= 100;
            this.snake.move();
        }
        this.snake.handleCursor(cursors)
    }
}

const config = {
    type: Phaser.AUTO,
    width: 810,
    height: 630,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 }
        }
    },
    scene: SnakeGame,
    backgroundColor: '#000000'
};

new Phaser.Game(config);
