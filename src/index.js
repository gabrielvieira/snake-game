'use strict';

import Phaser from 'phaser';
import logoImg from './assets/logo.png';
import {SnakeGameObject} from './objects/snake';

class SnakeGame extends Phaser.Scene
{
    constructor(config)
    {
        super(config);
        this.score = 0;
        this.gameOver = false;
        this.timer = 0;
    }

    create ()
    {
        this.snake = new SnakeGameObject(this)
        this.snake.add()
        this.scoreText = new Phaser.GameObjects.Text(this, 8, 8, 'score: 0', { fontSize: '16px', fill: '#ffffff' });
        this.add.existing(this.scoreText)
        this.triggerTimer = this.time.addEvent({
            callback: this.timerEvent,
            callbackScope: this,
            delay: 150, // 1000 = 1 second
            loop: true
        });
    }

    update (time, delta)
    {
        let cursors = this.input.keyboard.createCursorKeys();
        if (this.gameOver) {
            return;
        }
        // this.timer += delta;
        // while (this.timer > 300.0) {
        //     this.timer -= 100;
        //     this.snake.move()
        // }
        this.snake.handleCursor(cursors);
    }

    timerEvent() {
        if (this.gameOver) {
            return;
        }
        this.snake.move()
    }

    incrementScore() {
        this.score += 1
        this.scoreText.setText('Score: ' + this.score);
    }

    setGameOver() {
        this.gameOver = true;
        console.log("game over")
    }

    restartGame() {
        this.snake.reset()
    }
}

const config = {
    type: Phaser.AUTO,
    width: 815,
    height: 635,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 }
        }
    },
    scene: SnakeGame,
    backgroundColor: '#000000'
};

let game = new Phaser.Game(config);
